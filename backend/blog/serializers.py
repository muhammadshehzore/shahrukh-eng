from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            "title", "slug", "excerpt", "content", "image",
            "created_at", "meta_title", "meta_description", "meta_keywords"
        ]
