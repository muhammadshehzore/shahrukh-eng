import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
# from channels.auth import AuthMiddlewareStack 
from chat.routing import websocket_urlpatterns
from .middleware import JWTAuthMiddleware  # your JWT auth

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(  # Admin auth
            URLRouter(websocket_urlpatterns)
    ),
})
