"""
apps/permissions/views.py
─────────────────────────────────────────────────────────────────────────────
Permission CRUD ViewSet — OOP implementation built on the reusable core mixins.

Routes (all under /api/v1/permissions/, JWT-authenticated):
    GET    /permissions/          list (paginated, filtered, searchable)
    POST   /permissions/          create
    GET    /permissions/{id}/     retrieve
    PUT    /permissions/{id}/     update
    PATCH  /permissions/{id}/     partial update
    DELETE /permissions/{id}/     soft delete
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework import filters, viewsets
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.mixins import EnvelopeResponseMixin, SoftDeleteMixin
from apps.permissions.filters import PermissionFilter
from apps.permissions.models import Permission
from apps.permissions.serializers import PermissionSerializer


class PermissionViewSet(EnvelopeResponseMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    """
    CRUD for RBAC permissions. Defaults (from base settings):
    authentication = JWT, permission = IsAuthenticated.
    """

    queryset = Permission.objects.exclude(is_deleted=True).select_related("resource")
    serializer_class = PermissionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PermissionFilter
    search_fields = ["name", "code", "description", "resource__name", "resource__code"]
    ordering_fields = ["name", "code", "resource__name", "created_at", "is_active"]
    ordering = ["resource__name", "name"]