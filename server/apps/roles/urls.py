"""
apps/roles/urls.py
─────────────────────────────────────────────────────────────────────────────
Router-based URL wiring — registered under /api/v1/roles/ in config/urls.py.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework.routers import DefaultRouter

from apps.roles.views import RoleViewSet

app_name = "roles"

router = DefaultRouter()
router.register("", RoleViewSet, basename="role")

urlpatterns = router.urls
