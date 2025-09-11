# accounts/models.py
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class WebSocketAuthLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    token = models.TextField(null=True, blank=True)
    error = models.TextField(null=True, blank=True)  # ✅ added this
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        if self.user:
            return f"{self.user.username} - {self.created_at}"
        return f"Anonymous - {self.created_at}"
