from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Admin WS – authenticated via JWT
    re_path(r"ws/chat/admin/$", consumers.AdminChatConsumer.as_asgi()),

    # User WS – username optional, letters, numbers, underscores, dots, @, plus, hyphen
    re_path(r"ws/chat/user/(?P<username>[\w.@+\- ]*)/$", consumers.UserChatConsumer.as_asgi()),
]
