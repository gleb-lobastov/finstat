from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from face import views

urlpatterns = patterns(
    '',
    url(r'^$', views.index, name='face'),
    url(r'^finstat/', include('finstat.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/login/', 'django.contrib.auth.views.login', {'template_name': 'admin/login.html'}),
    url(r'^accounts/logout/', 'django.contrib.auth.views.logout'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
