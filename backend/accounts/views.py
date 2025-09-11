from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import AdminTokenObtainPairSerializer



User = get_user_model()

# 🔹 Register
@api_view(["POST"])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(password)
    except ValidationError as e:
        return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"detail": "User registered successfully"}, status=status.HTTP_201_CREATED)



# 🔹 Login (sirf admin/staff ke liye)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user is not None:
        if not user.is_staff:  # Ensure only admin/staff
            return Response({"error": "Not authorized"}, status=403)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        access['is_admin'] = user.is_staff  # ✅ Add is_admin claim

        return Response({
            "refresh": str(refresh),
            "access": str(access),
            "username": user.username,
        })
    else:
        return Response({"error": "Invalid credentials"}, status=400)



# 🔹 Logout
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        # Try to get refresh token from request body
        refresh_token = request.data.get("refresh")
        
        # Optional: fallback to Authorization header if not in body
        if not refresh_token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                refresh_token = auth_header.split(" ")[1]

        if not refresh_token:
            return Response({"detail": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()

        # Clear tokens from frontend
        return Response({"detail": "Logged out successfully"})
    except Exception as e:
        return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

# 🔹 Change Password
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user.check_password(old_password):
        return Response({"detail": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({"detail": "Password changed successfully"})


# 🔹 Forgot Password
@api_view(["POST"])
def forgot_password_view(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "No user with this email"}, status=status.HTTP_400_BAD_REQUEST)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

    send_mail(
        "Password Reset Request",
        f"Click the link to reset your password: {reset_link}",
        settings.EMAIL_HOST_USER,
        [user.email],
        fail_silently=False,
    )
    return Response({"detail": "Password reset link sent to email"})


# 🔹 Reset Password
@api_view(["POST"])
def reset_password_view(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"detail": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
        return Response({"detail": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)






class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_staff:
            return Response(
                {"detail": "You are not authorized to access admin"},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Use custom serializer to get token with is_admin
        refresh = AdminTokenObtainPairSerializer.get_token(user)
        access = refresh.access_token

        return Response({
            "refresh": str(refresh),
            "access": str(access),  # This token now has is_admin=True
            "username": user.username,
        }, status=status.HTTP_200_OK)
