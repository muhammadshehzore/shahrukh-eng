from django.contrib import admin
from django.utils.html import format_html
from .models import Blog
from .forms import BlogAdminForm
from django.contrib.admin import AdminSite

admin.site.site_header = "My Admin"
admin.site.index_title = "Dashboard"
admin.site.site_title = "Admin"

class MyAdminSite(AdminSite):
    class Media:
        css = {
            "all": ("css/ckeditor_admin_fix.css",)  # load globally
        }

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    form = BlogAdminForm

    class Media:
        css = {
            "all": ("css/ckeditor_admin_fix.css",)  # load your CSS globally
        }

    list_display = ("title", "created_at", "image_preview")
    list_filter = ("created_at",)
    search_fields = ("title", "excerpt", "meta_title", "meta_keywords")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at", "image_preview")

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "slug", "excerpt", "content", "image", "image_preview")
        }),
        ("SEO Settings", {
            "fields": ("meta_title", "meta_description", "meta_keywords"),
            "classes": ("collapse",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:60px; border-radius:4px;" />',
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Preview"
