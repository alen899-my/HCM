"""
apps/resources/views.py
─────────────────────────────────────────────────────────────────────────────
Resource CRUD ViewSet — OOP implementation built on the reusable core mixins.

Routes (all under /api/v1/resources/, JWT-authenticated):
    GET    /resources/          list (paginated, filtered, searchable)
    POST   /resources/          create
    GET    /resources/{id}/     retrieve
    PUT    /resources/{id}/     update
    PATCH  /resources/{id}/     partial update
    DELETE /resources/{id}/     soft delete
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework import filters, viewsets
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.mixins import EnvelopeResponseMixin, SoftDeleteMixin
from apps.resources.filters import ResourceFilter
from apps.resources.models import Resource
from apps.resources.serializers import ResourceSerializer


class ResourceViewSet(EnvelopeResponseMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    """
    CRUD for RBAC resources. Defaults (from base settings):
    authentication = JWT, permission = IsAuthenticated.
    """

    queryset = Resource.objects.exclude(is_deleted=True)
    serializer_class = ResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ResourceFilter
    search_fields = ["name", "code"]
    ordering_fields = ["name", "code", "created_at", "is_active"]
    ordering = ["name"]
