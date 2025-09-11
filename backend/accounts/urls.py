from django.urls import path
from .views import (
    register_view, login_view, logout_view, change_password_view,
    forgot_password_view, reset_password_view, AdminLoginView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin-login/", AdminLoginView.as_view(), name="admin_login"),
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("change-password/", change_password_view, name="change_password"),
    path("forgot-password/", forgot_password_view, name="forgot_password"),
    path("reset-password/<uidb64>/<token>/", reset_password_view, name="reset_password"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
