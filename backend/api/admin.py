from django.contrib import admin
from .models import Service, Products, HeroSlide,Quote, ServiceGalleryImage
from django.utils.html import format_html
from . forms import ServiceAdminForm, ProductAdminForm
from django.contrib.admin import AdminSite

admin.site.site_header = "My Admin"
admin.site.index_title = "Dashboard"
admin.site.site_title = "Admin"

class MyAdminSite(AdminSite):
    class Media:
        css = {
            "all": ("css/ckeditor_admin_fix.css",)  # load globally
        }
 

# Inline for gallery images
class ServiceGalleryInline(admin.TabularInline):
    model = ServiceGalleryImage
    extra = 1  # Number of empty forms
    fields = ("image", "caption", "image_preview")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 100px; height: auto; border-radius:4px;" />', 
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Preview"

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceAdminForm  # ✅ attach CKEditor widget
    class Media:
        css = {
            "all": ("css/ckeditor_admin_fix.css",)  # This will override admin CSS
        }

    list_display = (
        "name", 
        "slug", 
        "show_in_nav", 
        "show_in_footer", 
        "show_in_homepage_hero", 
        "created_at"
    )
    list_filter = ("show_in_nav", "show_in_footer", "show_in_homepage_hero", "created_at")
    search_fields = ("name", "tagline", "content")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ServiceGalleryInline]
    ordering = ("-created_at",)

    readonly_fields = ("meta_description_preview",)

    fieldsets = (
        (None, {
            "fields": (
                "name",
                "slug",
                "tagline",
                "meta_description",
                "meta_description_preview",
                "hero_image",
                "content",  # ✅ CKEditor will appear here
            )
            
        }),
        ("Display Options", {
            "fields": ("show_in_nav", "show_in_footer", "show_in_homepage_hero")
        }),
    )

    def meta_description_preview(self, obj):
        if obj.meta_description:
            return format_html(
                "<div style='max-width:400px; white-space:pre-wrap;'>{}</div>",
                obj.meta_description
            )
        return "-"
    meta_description_preview.short_description = "Meta Description Preview"



@admin.register(Products)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "short_desc", "image_preview")
    search_fields = ("title", "desc")
    list_filter = ("title",)
    readonly_fields = ("image_preview",)

    def short_desc(self, obj):
        return obj.desc[:50] + "..." if len(obj.desc) > 50 else obj.desc

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="width:100px; height:auto; border-radius:8px;" />'
        return "No image"
    image_preview.allow_tags = True
    image_preview.short_description = "Image Preview"

 

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "button_text")
    search_fields = ("title",)



@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "phone", "service", "product", "created_at")
    list_filter = ("service", "product", "created_at")
    search_fields = ("name", "email", "phone", "service", "product")
    readonly_fields = ("created_at",)

    fieldsets = (
        (None, {"fields": ("name", "email", "phone", "message")}),
        ("Product / Service Info", {"fields": ("service", "product")}),
        ("Metadata", {"fields": ("created_at",)}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).order_by("-created_at")