"""
apps/permissions/urls.py
─────────────────────────────────────────────────────────────────────────────
Router-based URL wiring — registered under /api/v1/permissions/ in config/urls.py.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework.routers import DefaultRouter

from apps.permissions.views import PermissionViewSet

app_name = "permissions"

router = DefaultRouter()
router.register("", PermissionViewSet, basename="permission")

urlpatterns = router.urls