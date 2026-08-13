"""
apps/core/views.py
─────────────────────────────────────────────────────────────────────────────
Core views including API health check and root welcome endpoint.
─────────────────────────────────────────────────────────────────────────────
"""

from django.conf import settings
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """
    API Health Check endpoint.
    Verifies DB connection to Neon PostgreSQL and returns system status.
    """
    db_status = "connected"
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
    except Exception as exc:
        db_status = f"disconnected: {exc}"

    return Response({
        "success": True,
        "data": {
            "status": "online",
            "database": db_status,
            "version": "1.0.0",
            "environment": "development" if settings.DEBUG else "production",
            "api_root": "/api/v1/",
        },
        "message": "Hospital Management System API is live and healthy",
        "errors": None,
        "meta": None,
    })
