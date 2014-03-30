from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from hellodjango.blog.models import BlogPost

# Create your views here.

def archive(request):
    posts = BlogPost.objects.all()
    context = {'posts': posts}
    return render(request, 'archive.html', context)
