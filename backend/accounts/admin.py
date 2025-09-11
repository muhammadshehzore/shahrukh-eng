from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.admin.sites import NotRegistered

# Permission ko unregister karna (agar chahiye to)
try:
    admin.site.unregister(Permission)
except NotRegistered:
    pass

# ✅ Agar aapke khud ke models hain to yahan register karen
# from .models import Profile
# admin.site.register(Profile)
