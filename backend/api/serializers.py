from rest_framework import serializers
from .models import Service, HeroSlide, Product, ProductGalleryImage, Quote, ContactMessage
from django.utils.html import strip_tags




class ServiceSerializer(serializers.ModelSerializer):
    hero_image = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "slug",
            "name",
            "tagline",
            "hero_image",
            "image",
            "content",   # HTML raw bhejna
            "gallery",
            "show_in_nav",
            "show_in_footer",
            "show_in_homepage_hero",
        ]

    # absolute URL builder
    def _abs_url(self, request, path_or_field):
        if path_or_field is None:
            return None
        if hasattr(path_or_field, "url"):
            return request.build_absolute_uri(path_or_field.url)
        if isinstance(path_or_field, str) and path_or_field:
            return request.build_absolute_uri(f"/media/{path_or_field.lstrip('/')}")
        return None

    def get_hero_image(self, obj):
        request = self.context.get("request")
        if obj.hero_image:
            if request:
                return self._abs_url(request, obj.hero_image)
            return getattr(obj.hero_image, "url", None)
        return None

    def get_image(self, obj):
        return self.get_hero_image(obj)

    def get_gallery(self, obj):
        request = self.context.get("request")
        if not obj.gallery:
            return []
        result = []
        for item in obj.gallery:
            if request:
                result.append(self._abs_url(request, item))
            else:
                if isinstance(item, str):
                    result.append(f"/media/{item.lstrip('/')}")
        return result

    # ⚡ Ensure content raw HTML string hai (escaped nahi)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["content"] = str(instance.content) if instance.content else ""
        return data


class ProductGalleryImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductGalleryImage
        fields = ["id", "image", "caption"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    description_text = serializers.SerializerMethodField()
    hero_image = serializers.SerializerMethodField()
    gallery = ProductGalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "tagline",
            "meta_description",
            "hero_image",
            "description",
            "description_text",
            "price",
            "in_stock",
            "gallery",
            "created_at",
        ]

    def get_description_text(self, obj):
        return strip_tags(obj.description) if obj.description else ""

    def get_hero_image(self, obj):
        request = self.context.get("request")
        if obj.hero_image and hasattr(obj.hero_image, "url"):
            return request.build_absolute_uri(obj.hero_image.url) if request else obj.hero_image.url
        return None


class HeroSlideSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HeroSlide
        fields = ["title", "subtitle", "image", "button_text", "button_link"]

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url)

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = [
            "id", "name", "email", "phone",
            "height", "width", "length", "thickness", "size_unit",
            "service", "product", "message", "created_at",
        ]
        extra_kwargs = {
            "phone": {"required": False},
            "height": {"required": False},
            "width": {"required": False},
            "length": {"required": False},
            "thickness": {"required": False},
            "size_unit": {"required": False},
            "service": {"required": False},
            "product": {"required": False},
        }

    def validate(self, data):
        if not data.get("product") and not data.get("service"):
            raise serializers.ValidationError("Either product or service must be provided.")
        return data







class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "message", "created_at"]
