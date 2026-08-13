"""
config/urls.py
─────────────────────────────────────────────────────────────────────────────
Root URL configuration.
All app routes are namespaced under /api/v1/.
Root URL (/) and /api/v1/health/ return API health check.
─────────────────────────────────────────────────────────────────────────────
"""

from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from apps.core.views import health_check

# API v1 URL patterns
api_v1_patterns = [
    path("health/",       health_check,                       name="health"),
    path("auth/",         include("apps.authentication.urls")),
    path("patients/",     include("apps.patients.urls")),
    path("doctors/",      include("apps.doctors.urls")),
    path("appointments/", include("apps.appointments.urls")),
    path("wards/",        include("apps.wards.urls")),
    path("pharmacy/",     include("apps.pharmacy.urls")),
    path("lab/",          include("apps.laboratory.urls")),
    path("billing/",      include("apps.billing.urls")),
    path("reports/",      include("apps.reports.urls")),
    path("resources/",    include("apps.resources.urls")),
    path("permissions/",  include("apps.permissions.urls")),
]

urlpatterns = [
    # Root health check endpoint (prevents 404 on http://localhost:8000/)
    path("", health_check, name="root-health"),

    # Django admin
    path("admin/", admin.site.urls),

    # Versioned API root
    path("api/v1/", include((api_v1_patterns, "v1"))),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
