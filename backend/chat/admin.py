# from django.contrib import admin
# from django.urls import path
# from django.shortcuts import render
# from .models import ChatRoom, ChatMessage

# @admin.register(ChatRoom)
# class ChatRoomAdmin(admin.ModelAdmin):
#     list_display = ("room_name", "user_name", "email", "created_at")

# @admin.register(ChatMessage)
# class ChatMessageAdmin(admin.ModelAdmin):
#     list_display = ("room", "sender", "message", "timestamp")

# # --- Custom Live Chat Page ---
# def live_chat_view(request):
#     rooms = ChatRoom.objects.all().order_by("-created_at")
#     return render(request, "admin/live_chat.html", {"rooms": rooms})

# # Add custom admin url
# def get_admin_urls(get_urls):
#     def urls():
#         extra = [
#             path("live-chat/", admin.site.admin_view(live_chat_view), name="live-chat"),
#         ]
#         return extra + get_urls()
#     return urls

# admin.site.get_urls = get_admin_urls(admin.site.get_urls)
