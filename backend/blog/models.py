from django.db import models
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field   # ✅ import


# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(blank=True)  # Short preview for listings
    content = CKEditor5Field("Content", config_name="default")  # ✅ CKEditor field
    image = models.ImageField(upload_to="blogs/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # SEO fields
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title[:70]
        if not self.meta_description and self.excerpt:
            self.meta_description = self.excerpt[:160]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
