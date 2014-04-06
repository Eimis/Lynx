from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from lynx.views import  Hello, App, New, Remove_summary, Remove_topic, Dashboard, Login, Logout, New_subject
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
admin.autodiscover()


urlpatterns = patterns('',
	url(r'^$', Hello),
	url(r'^app/$', App),

	url(r'^dashboard/$', Dashboard),
	url(r'^login/$', Login),
	url(r'^logout/$', Logout),
	url(r'^app/new/$', New),
	url(r'^new_subject/$', New_subject),

    url(r'^app/(?P<slug>[-\w]+)/$', App),

	url(r'^app/remove_summary/(?P<id>[-\w]+)/$', Remove_summary),
	url(r'^app/remove_topic/(?P<id>[-\w]+)/$', Remove_topic),
	url(r'^admin/', include(admin.site.urls)),
	url(r'^user/password/reset/$', # TODO: better url's
        'django.contrib.auth.views.password_reset', 
        {'post_reset_redirect' : '/user/password/reset/done/'},
        name="password_reset"),
    (r'^user/password/reset/done/$',
        'django.contrib.auth.views.password_reset_done'),
    (r'^user/password/reset/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 
        'django.contrib.auth.views.password_reset_confirm', 
        {'post_reset_redirect' : '/user/password/done/'}),
    (r'^user/password/done/$', 
        'django.contrib.auth.views.password_reset_complete'),



	) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
	urlpatterns += staticfiles_urlpatterns()

