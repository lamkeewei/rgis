from django.conf.urls import patterns, include, url


from hellodjango.blog.views import archive

urlpatterns = patterns('',
    url(r'^$', archive),
)