# chat/models.py
import uuid
from django.db import models

class ChatRoom(models.Model):
    """A room for user-admin chat"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, null=True, blank=True)  # user's provided name
    email = models.EmailField(null=True, blank=True)  # Optional email if user provides
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatRoom({self.name or self.email or 'Anonymous'})"


class ChatMessage(models.Model):
    """A message in a chat"""
    SENDER_CHOICES = [
        ("user", "User"),
        ("admin", "Admin")
    ]

    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:20]}"
