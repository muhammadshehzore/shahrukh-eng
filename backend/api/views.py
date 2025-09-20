from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Service, Product, HeroSlide, Quote, ContactMessage
from .serializers import ServiceSerializer, ProductSerializer, HeroSlideSerializer, QuoteSerializer,  ContactMessageSerializer


# -------------------------------
# 🔹 Services
# -------------------------------
@api_view(["GET"])
def service_list(request):
    services = Service.objects.all()
    serializer = ServiceSerializer(services, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def service_detail(request, slug):
    service = get_object_or_404(Service, slug=slug)
    serializer = ServiceSerializer(service, context={"request": request})
    return Response(serializer.data)


# -------------------------------
# 🔹 Products
# -------------------------------


# Helper to clean foreign keys
def clean_foreign_keys(data, fk_fields):
    """
    Converts empty strings in foreign key fields to None
    """
    for field in fk_fields:
        if data.get(field) == "":
            data[field] = None
    return data

@api_view(["POST"])
def product_create(request):
    """Create a new product"""
    data = request.data.copy()
    fk_fields = ["category", "brand"]  # Add all your ForeignKey fields here
    data = clean_foreign_keys(data, fk_fields)

    serializer = ProductSerializer(data=data, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "PATCH"])
def product_update(request, pk):
    """Update an existing product"""
    product = get_object_or_404(Product, pk=pk)
    
    data = request.data.copy()
    fk_fields = ["category", "brand"]  # Add all your ForeignKey fields here
    data = clean_foreign_keys(data, fk_fields)

    serializer = ProductSerializer(product, data=data, partial=True, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def product_list(request):
    """List all products"""
    products = Product.objects.all().order_by("-created_at")
    serializer = ProductSerializer(products, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def product_detail(request, slug):
    """Retrieve a single product by slug"""
    product = get_object_or_404(Product, slug=slug)
    serializer = ProductSerializer(product, context={"request": request})
    return Response(serializer.data)


@api_view(["DELETE"])
def product_delete(request, pk):
    """Delete a product"""
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# -------------------------------
# 🔹 Hero Slides
# -------------------------------
@api_view(["GET"])
def hero_slides(request):
    slides = HeroSlide.objects.all()
    serializer = HeroSlideSerializer(slides, many=True, context={"request": request})
    return Response(serializer.data)


# -------------------------------
# 🔹 Quotes
# -------------------------------
# @api_view(["POST"])
# def create_quote(request):
#     serializer = QuoteSerializer(data=request.data)
#     if serializer.is_valid():
#         quote = serializer.save()
#         return Response(
#             {
#                 "message": "Quote created successfully",
#                 "quote": QuoteSerializer(quote).data,
#             },
#             status=status.HTTP_201_CREATED,
#         )
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Helper to clean foreign keys and optional fields
def clean_quote_data(data):
    data = data.copy()
    # Convert empty strings to None
    if data.get("product") == "":
        data["product"] = None
    if data.get("service") == "":
        data["service"] = None
    return data

@api_view(["POST"])
def create_quote(request):
    serializer = QuoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def create_contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
