from django import forms
from django_ckeditor_5.widgets import CKEditor5Widget
from .models import Blog

class BlogAdminForm(forms.ModelForm):
    content = forms.CharField(
        widget=CKEditor5Widget(
            config_name="default",
            attrs={
                "style": "width: 100%; min-height: 400px;"
            }
        )
    )

    class Meta:
        model = Blog
        fields = "__all__"
