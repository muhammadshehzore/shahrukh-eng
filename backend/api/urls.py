from django.urls import path
from . import views

urlpatterns = [
    path("services/", views.service_list, name="service_list"),
    path("services/<slug:slug>/", views.service_detail, name="service_detail"),

    path("products/", views.product_list, name="product-list"),
    path("products/create/", views.product_create, name="product-create"),
    path("products/<slug:slug>/", views.product_detail, name="product-detail"),
    path("products/<int:pk>/update/", views.product_update, name="product-update"),
    path("products/<int:pk>/delete/", views.product_delete, name="product-delete"),

    # ✅ Only keep this
    path("quotes/", views.create_quote, name="create-quote"),

    path("hero-slides/", views.hero_slides, name="hero_slides"),
    path("contact/messages/", views.create_contact_message, name="create-contact-message"),
]
