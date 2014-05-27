from django.db import models
from hellodjango import settings

import os
# Create your models here.

class Plugin(models.Model):
    function_name = models.CharField(max_length=100)
    rscript = models.FileField(upload_to='plugins')
    name = models.CharField(max_length=150)
    def get_full_path(self):
        return settings.MEDIA_ROOT + self.rscript.name

class Shapefile(models.Model):
    zipfile = models.FileField(upload_to='shapefile')
    name = models.CharField(max_length=150)
    filename = models.CharField(max_length=150,null=True, blank=True)
    def __unicode__(self):
        return "path: " + str(self.zipfile.url) + " filename: " + str(self.filename)
    def get_full_path(self):
        return os.path.join(settings.MEDIA_ROOT, "shapefile", self.name, self.filename)
        # windows path
        # return settings.MEDIA_ROOT + "shapefile\\" + self.name + "\\" + self.filename