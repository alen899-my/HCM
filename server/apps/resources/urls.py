"""
apps/resources/urls.py
─────────────────────────────────────────────────────────────────────────────
Router-based URL wiring — registered under /api/v1/resources/ in config/urls.py.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework.routers import DefaultRouter

from apps.resources.views import ResourceViewSet

app_name = "resources"

router = DefaultRouter()
router.register("", ResourceViewSet, basename="resource")

urlpatterns = router.urls
