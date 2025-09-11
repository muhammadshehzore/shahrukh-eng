from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import ChatRoom, ChatMessage
from .serializers import ChatRoomSerializer, ChatMessageSerializer


# ✅ List all chat rooms (Admin only)
class ChatRoomListView(generics.ListAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAdminUser]


# ✅ Room detail + history (GET by room name)
class ChatRoomDetailView(generics.RetrieveAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]  # ya IsAdminUser
    lookup_field = "name"   # e.g. /api/chat/rooms/<room_name>/


# ✅ End a chat room (POST/PUT by room name)
class EndChatView(generics.UpdateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAdminUser]  # sirf admin end kar sake
    lookup_field = "name"

    def update(self, request, *args, **kwargs):
        room = self.get_object()
        room.active = False
        room.save()
        return Response({"status": "ended"}, status=status.HTTP_200_OK)


# ✅ List + Create messages for a room (Admin only)
class ChatMessageListView(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        room_id = self.kwargs["room_id"]
        return ChatMessage.objects.filter(room_id=room_id)

    def perform_create(self, serializer):
        room_id = self.kwargs["room_id"]
        serializer.save(room_id=room_id, sender="admin")
