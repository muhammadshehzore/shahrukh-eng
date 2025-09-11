from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Blog
from .serializers import BlogSerializer
# Create your views here.

@api_view(["GET"])
def blog_list(request):
    blogs = Blog.objects.all()
    serializer = BlogSerializer(blogs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def blog_detail(request, slug):
    try:
        blog = Blog.objects.get(slug=slug)
    except Blog.DoesNotExist:
        return Response({"error": "Blog not found"}, status=404)
    serializer = BlogSerializer(blog)
    return Response(serializer.data)
