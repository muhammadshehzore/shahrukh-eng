from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Service, Products, HeroSlide, Quote, ContactMessage
from .serializers import ServiceSerializer, ProductsSerializer, HeroSlideSerializer, QuoteSerializer,  ContactMessageSerializer


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
@api_view(['GET'])
def products_list(request):
    products = Products.objects.all()
    serializer = ProductsSerializer(products, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def product_detail(request, slug):
    product = get_object_or_404(Products, slug=slug)
    serializer = ProductsSerializer(product, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


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

@api_view(["POST"])
def create_quote(request):
    serializer = QuoteSerializer(data=request.data)
    if serializer.is_valid():
        quote = serializer.save()
        return Response(
            {
                "message": "Quote created successfully",
                "quote": QuoteSerializer(quote).data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






@api_view(["POST"])
def create_contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
