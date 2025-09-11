# middleware.py
from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from django.contrib.auth.models import AnonymousUser, User
from accounts.models import WebSocketAuthLog

@database_sync_to_async
def get_user(user_id: int):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

@database_sync_to_async
def log_failed_auth(token, error):
    WebSocketAuthLog.objects.create(token=token, error=str(error))

class JWTAuthMiddleware(BaseMiddleware):
    """
    JWT middleware for Django Channels.
    Admin connections require a valid access token in query string.
    User connections allow anonymous access.
    """

    async def __call__(self, scope, receive, send):
        path = scope.get("path", "")

        # --- User path: no token required ---
        if path.startswith("/ws/chat/user/"):
            scope["user"] = AnonymousUser()
            return await super().__call__(scope, receive, send)

        # --- Admin path: require valid access token ---
        query_string = scope.get("query_string", b"").decode()
        token_list = parse_qs(query_string).get("token")
        user = AnonymousUser()

        if not token_list or not token_list[0] or token_list[0] == "null":
            print("JWTAuthMiddleware: No token provided for admin")
            return await super().__call__(scope, receive, send)

        token_str = token_list[0]

        try:
            # Only accept access token
            token_obj = AccessToken(token_str)
            user_id = token_obj.get("user_id")
            if user_id is None:
                raise ValueError("Token missing 'user_id'")
            user = await get_user(user_id)
        except TokenError as e:
            await log_failed_auth(token_str, e)
            print(f"JWTAuthMiddleware: Invalid token - {e}")
        except Exception as e:
            await log_failed_auth(token_str, e)
            print(f"JWTAuthMiddleware: Error processing token - {e}")

        scope["user"] = user
        return await super().__call__(scope, receive, send)
