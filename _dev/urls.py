from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = patterns(
        '',
        url(r'^$', views.index, name='index'),
        url(r'^finstat/', include('finstat.urls')),
        url(r'^admin/', admin.site.urls),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
