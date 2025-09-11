import json
import uuid
import jwt
import asyncio
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import ChatMessage, ChatRoom

User = get_user_model()
online_users = set()


# -----------------------------
# 🟢 User Chat Consumer
# -----------------------------
class UserChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.name = self.scope["url_route"]["kwargs"].get("username") or f"Guest_{uuid.uuid4().hex[:6]}"
        self.room_group_name = f"chat_{self.name}"

        try:
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            online_users.add(self.name)
            await self.restore_session()

            # Notify admin
            await self.channel_layer.group_send(
                "chat_admin",
                {"type": "user_status", "user": self.name, "online": True}
            )
            await self.channel_layer.group_send(
                "chat_admin",
                {"type": "online_users_update", "users": list(online_users)}
            )

            await self.start_ping_loop()
        except Exception as e:
            print(f"❌ User connect error: {e}")

    async def disconnect(self, close_code):
        if hasattr(self, "_ping_task"):
            self._ping_task.cancel()
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        if hasattr(self, "name"):
            online_users.discard(self.name)
            await self.channel_layer.group_send(
                "chat_admin",
                {"type": "user_status", "user": self.name, "online": False}
            )
            await self.channel_layer.group_send(
                "chat_admin",
                {"type": "online_users_update", "users": list(online_users)}
            )
            print(f"👋 User disconnected {self.name}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("content", "")
        if not message:
            return

        msg_id = str(uuid.uuid4())
        await self.save_session(message)

        event = {
            "type": "chat_message",
            "content": message,
            "sender": self.name,
            "id": msg_id,
            "timestamp": timezone.now().isoformat(),
        }

        # Send to admin and self
        await self.channel_layer.group_send("chat_admin", event)
        await self.channel_layer.group_send(self.room_group_name, event)

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_status(self, event):
        await self.send(text_data=json.dumps(event))

    async def start_ping_loop(self):
        async def ping():
            try:
                while True:
                    await asyncio.sleep(120)
            except asyncio.CancelledError:
                pass
        self._ping_task = asyncio.create_task(ping())

    @database_sync_to_async
    def save_session(self, content):
        room, _ = ChatRoom.objects.get_or_create(name=self.name)
        # Handle room field properly
        if hasattr(ChatMessage, "room"):
            return ChatMessage.objects.create(room=room, sender=self.name, content=content)
        return ChatMessage.objects.create(room_id=room.id, sender=self.name, content=content)

    @database_sync_to_async
    def get_previous_messages(self):
        room, _ = ChatRoom.objects.get_or_create(name=self.name)
        messages = list(
            room.messages.order_by("timestamp").values("sender", "content", "timestamp")
        )
        for m in messages:
            if isinstance(m["timestamp"], timezone.datetime):
                m["timestamp"] = m["timestamp"].isoformat()
        return messages

    async def restore_session(self):
        messages = await self.get_previous_messages()
        if messages:
            await self.send(text_data=json.dumps({"type": "previous_messages", "messages": messages}))


# -----------------------------
# 🔴 Admin Chat Consumer
# -----------------------------
class AdminChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_params = {}
        if self.scope["query_string"]:
            raw_qs = self.scope["query_string"].decode()
            query_params = {k: v[0] for k, v in parse_qs(raw_qs).items()}

        token = query_params.get("token")
        user = await self.get_user_from_token(token)
        if not user or not user.is_staff:
            await self.close()
            return

        self.user = user
        self.room_group_name = "chat_admin"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.send_online_users()
        await self.start_refresh_loop()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("content", "")
        target = data.get("target")
        if not message or not target:
            return

        msg_id = str(uuid.uuid4())
        await self.save_session(message, target)

        event = {
            "type": "chat_message",
            "content": message,
            "sender": "admin",
            "target": target,
            "id": msg_id,
            "timestamp": timezone.now().isoformat(),
        }

        # Send to target user and admin
        await self.channel_layer.group_send(f"chat_{target}", event)
        await self.channel_layer.group_send("chat_admin", event)

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_status(self, event):
        await self.send(text_data=json.dumps(event))

    async def online_users_update(self, event):
        await self.send(text_data=json.dumps({"type": "online_users", "users": event["users"]}))

    async def send_online_users(self):
        await self.send(text_data=json.dumps({
            "type": "online_users",
            "users": list(online_users)
        }))

    async def start_refresh_loop(self):
        async def loop():
            try:
                while True:
                    await asyncio.sleep(120)
                    await self.send_online_users()
            except asyncio.CancelledError:
                pass
        self._refresh_task = asyncio.create_task(loop())

    @database_sync_to_async
    def save_session(self, content, target):
        room, _ = ChatRoom.objects.get_or_create(name=target)
        if hasattr(ChatMessage, "room"):
            return ChatMessage.objects.create(room=room, sender="admin", content=content)
        return ChatMessage.objects.create(room_id=room.id, sender="admin", content=content)

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            user = User.objects.filter(id=user_id).first()
            return user if user and user.is_staff else None
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
