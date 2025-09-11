from rest_framework import serializers
from .models import Service, HeroSlide, Products, Quote

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


class ProductsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Products
        fields = ["id", "title", "desc", "image", "slug"]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
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
            "height", "width", "length", "thickness",
            "size_unit", "service", "product", "message", "created_at"
        ]
    class Meta:
        model = Quote
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "height",
            "width",
            "length",
            "thickness",
            "size_unit",
            "service",
            "product",  # ✅ added product
            "message"
        ]