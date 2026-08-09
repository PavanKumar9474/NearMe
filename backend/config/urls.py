from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from places.views import CategoryViewSet, PlaceViewSet, PlaceSuggestionViewSet
from users.views import UserViewSet, SearchHistoryViewSet, FavoriteViewSet
from reports.views import PlaceReportViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'places', PlaceViewSet)
router.register(r'suggestions', PlaceSuggestionViewSet)
router.register(r'users', UserViewSet)
router.register(r'search-history', SearchHistoryViewSet)
router.register(r'favorites', FavoriteViewSet)
router.register(r'reports', PlaceReportViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
