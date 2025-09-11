from django.urls import path
from . import views

urlpatterns = [
    path("services/", views.service_list, name="service_list"),
    path("services/<slug:slug>/", views.service_detail, name="service_detail"),

    path("products/", views.products_list, name="products_list"),
    path("products/<slug:slug>/", views.product_detail, name="product_detail"),
    path("quotes/", views.create_quote, name="create-quote"),


    path("hero-slides/", views.hero_slides, name="hero_slides"),

    path("quotes/", views.create_quote, name="create_quote"),
]
