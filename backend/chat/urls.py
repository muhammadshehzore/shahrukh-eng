from django.urls import path
from .views import (
    ChatRoomListView,
    ChatRoomDetailView,
    EndChatView,
    ChatMessageListView,
)

urlpatterns = [
    path("rooms/", ChatRoomListView.as_view(), name="chat-room-list"),
    path("rooms/<str:name>/", ChatRoomDetailView.as_view(), name="chat-room-detail"),
    path("rooms/<str:name>/end/", EndChatView.as_view(), name="chat-room-end"),
    path("rooms/<int:room_id>/messages/", ChatMessageListView.as_view(), name="chat-messages"),
]
