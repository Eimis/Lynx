from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from lynx.views import  Hello, App, New
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
admin.autodiscover()


urlpatterns = patterns('',
	url(r'^$', Hello),
	url(r'^app/$', App),
	url(r'^app/new/$', New),
	#url(r'^app/(?P<pk>\d+)/$', ),
	#url(r'app/(?P<pk>\d+)/$', ),
	url(r'^admin/', include(admin.site.urls)),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()