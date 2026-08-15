"""
apps/roles/views.py
─────────────────────────────────────────────────────────────────────────────
Role CRUD ViewSet — OOP implementation built on the reusable core mixins.

Routes (all under /api/v1/roles/, JWT-authenticated):
    GET    /roles/          list (paginated, filtered, searchable)
    POST   /roles/          create (auto-provisions permission cells)
    GET    /roles/{id}/     retrieve (includes permission_matrix)
    PUT    /roles/{id}/     update
    PATCH  /roles/{id}/     partial update
    DELETE /roles/{id}/     soft delete
─────────────────────────────────────────────────────────────────────────────
"""

from django.db.models import Count
from rest_framework import filters, viewsets
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.mixins import EnvelopeResponseMixin, SoftDeleteMixin
from apps.permissions.models import Permission
from apps.roles.filters import RoleFilter
from apps.roles.models import CRUD_ACTIONS, Role
from apps.roles.serializers import RoleSerializer


class RoleViewSet(EnvelopeResponseMixin, SoftDeleteMixin, viewsets.ModelViewSet):
    """
    CRUD for RBAC roles. Defaults (from base settings):
    authentication = JWT, permission = IsAuthenticated.
    """

    queryset = (
        Role.objects.exclude(is_deleted=True)
        .prefetch_related("permissions__resource")
        .annotate(_permissions_count=Count("permissions"))
    )
    serializer_class = RoleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = RoleFilter
    search_fields = ["name", "code", "description"]
    ordering_fields = ["name", "code", "_permissions_count", "created_at", "is_active"]
    ordering = ["name"]

    def retrieve(self, request, *args, **kwargs):
        """Include the permission matrix only on detail responses."""
        instance = self.get_object()
        context = self.get_serializer_context()
        context["include_matrix"] = True
        serializer = self.get_serializer(instance, context=context)
        return self._ok(serializer.data)

    def perform_create(self, serializer):
        cells = serializer.validated_data.pop("permissions", [])
        role = serializer.save()
        self._sync_permissions(role, cells)

    def perform_update(self, serializer):
        cells = serializer.validated_data.pop("permissions", [])
        role = serializer.save()
        if "permissions" in serializer.initial_data:
            self._sync_permissions(role, cells)

    def _sync_permissions(self, role, cells):
        """Provision one Permission per checked (resource, action) cell and link them."""
        permission_ids = []
        for resource, action in cells:
            code = Role.permission_code(resource.code, action)
            permission, _ = Permission.objects.get_or_create(
                resource=resource,
                code=code,
                defaults={
                    "name": f"{CRUD_ACTIONS[action]} {resource.name}",
                    "description": f"Auto-provisioned {action} permission on {resource.name}.",
                    "is_active": True,
                },
            )
            permission_ids.append(permission.id)
        role.permissions.set(permission_ids)
