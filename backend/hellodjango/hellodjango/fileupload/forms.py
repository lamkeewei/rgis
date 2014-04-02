from django import forms

class UploadForm(forms.Form):
    name = forms.CharField(max_length=150)
    upload_file = forms.FileField(
        label = 'Select a .zip file',
        help_text = 'max 2.5 megabytes'
    )

class ShapefileUploadsForm(forms.Form):
    name = forms.CharField(max_length=150)
    projection = forms.CharField(max_length=150, required=False)

    shapefile = forms.FileField(
        label = 'Select shapefile zip'
    )

class KfunctionInitializeForm(forms.Form):
    namespace = forms.CharField(max_length=150, required=False)
    point = forms.CharField(max_length=150)
    window = forms.CharField(max_length=150)

class KfunctionKDEInitializeForm(forms.Form):
    namespace = forms.CharField(max_length=150, required=False)
    point = forms.CharField(max_length=150)
    window = forms.CharField(max_length=150)
    bandwidth = forms.CharField(max_length=15)

class GWRInitializeForm(forms.Form):
    namespace = forms.CharField(max_length=150, required=False)