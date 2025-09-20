from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.utils.html import strip_tags
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import ValidationError 





class Service(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    tagline = models.CharField(max_length=255, blank=True)

    meta_description = models.CharField(
        max_length=160,
        blank=True,
        help_text="SEO meta description (max 160 chars) shown in search results"
    )

    hero_image = models.ImageField(upload_to="services/hero/", blank=True, null=True)

    # ✅ CKEditor5 rich text field (instead of TextField)
    content = CKEditor5Field("Text", config_name="default", blank=True)

    gallery = models.JSONField(default=list, blank=True)

    show_in_nav = models.BooleanField(default=True)
    show_in_footer = models.BooleanField(default=True)
    show_in_homepage_hero = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.meta_description and self.content:
            # Strip HTML tags and truncate
            plain_text = strip_tags(str(self.content))
            self.meta_description = plain_text[:157] + "..."
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ServiceGalleryImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="services/gallery/")
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.service.name} - {self.caption or 'Image'}"


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    tagline = models.CharField(max_length=255, blank=True)

    meta_description = models.CharField(
        max_length=160,
        blank=True,
        help_text="SEO meta description (max 160 chars) shown in search results"
    )

    hero_image = models.ImageField(upload_to="products/hero/", blank=True, null=True)

    # ✅ CKEditor rich text field
    description = CKEditor5Field("Text", config_name="default", blank=True)

    gallery = models.JSONField(default=list, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    in_stock = models.BooleanField(default=True)

    show_in_nav = models.BooleanField(default=True)
    show_in_footer = models.BooleanField(default=True)
    show_in_homepage_hero = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        if not self.meta_description and self.description:
            plain_text = strip_tags(str(self.description))
            self.meta_description = plain_text[:157] + "..."

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductGalleryImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="products/gallery/")
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.product.name} - {self.caption or 'Image'}"

class HeroSlide(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="hero-slides/")
    button_text = models.CharField(max_length=50, blank=True, null=True)
    button_link = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title


class Quote(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)  # optional

    height = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    width = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    length = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    thickness = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    size_unit = models.CharField(
        max_length=10,
        choices=[("inch", "Inch"), ("ft", "Feet"), ("mm", "Millimeter")],
        blank=True,
        null=True
    )

    service = models.CharField(max_length=255, blank=True, null=True)
    product = models.CharField(max_length=255, blank=True, null=True)  # Store name directly

    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Ensure only one of product or service is set
        if self.product and self.service:
            raise ValidationError("Only one of product or service can be set.")
        if not self.product and not self.service:
            raise ValidationError("Either product or service must be provided.")

    def __str__(self):
        target = self.product or self.service
        return f"Quote from {self.name} for {target}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"
