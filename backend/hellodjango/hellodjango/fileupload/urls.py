from django.conf.urls import patterns, include, url

from hellodjango.fileupload import views

urlpatterns = patterns('',
    # /api/plugin/1/
    # url(r'^api/plugin/(?P<plugin_id>\d+)/$', views.shapefile_upload, name='shapefile_upload'),
    # /api/plugin/
    url(r'^api/plugin/$', views.plugin_upload_form, name='plugin_upload_form'),
    # /api/upload
    url(r'^api/upload/$', views.shapefile_upload, name='shapefile_upload'),
    # /api/plugin/kfunction/initialize
    url(r'^api/plugin/kfunction/initialize/$', views.kfunction_initialize, name='kfunction_initialize'),
    url(r'^api/plugin/kfunction/kde/$', views.kde_function, name='kde_function'),
    url(r'^api/plugin/correlation/initialize/$', views.gwr_initialize, name='gwr_initialize'),
    url(r'^api/plugin/correlation/plot/$', views.gwr_plot, name='gwr_plot'),
    url(r'^api/get_csrftoken/$', views.get_csrftoken, name='get_csrftoken'),
    url(r'^api/initialize/$', views.initialize_app, name='initialize_app'),
)
