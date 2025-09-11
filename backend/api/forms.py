# admin.py (or forms.py if you prefer)
from django import forms
from django_ckeditor_5.widgets import CKEditor5Widget
from .models import Service, Products

class ProductAdminForm(forms.ModelForm):
    desc = forms.CharField(
        label="Description",
        required=False,
        widget=CKEditor5Widget(
            config_name="default",
            attrs={
                "style": "width: 100%; min-height: 400px;"
            }
        )
    )

    class Meta:
        model = Products
        fields = "__all__"


class ServiceAdminForm(forms.ModelForm):
    content = forms.CharField(
        label="Content",
        required=False,
        widget=CKEditor5Widget(
            config_name="default",
            attrs={
                "style": "width: 100%; min-height: 400px;"
            }
        )
    )

    class Meta:
        model = Service
        fields = "__all__"
