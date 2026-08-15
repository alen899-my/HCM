"""
apps/roles/serializers.py
─────────────────────────────────────────────────────────────────────────────
Role API serializers.

`permissions` is a write-only list of checked grid cells:

    [{"resource_id": "<uuid>", "action": "create"}, ...]

The viewset provisions a Permission per cell (see RoleViewSet) and links it
to the role. `permission_matrix` is returned read-only on detail responses
so the frontend can re-render the checkbox grid:

    {"<resource_id>": {"create": "<permission_id>", "read": null, ...}}
─────────────────────────────────────────────────────────────────────────────
"""

from django.utils.text import slugify
from rest_framework import serializers

from apps.permissions.models import Permission
from apps.resources.models import Resource
from apps.roles.models import CRUD_ACTIONS, Role


class RoleSerializer(serializers.ModelSerializer):
    """Full detail / list serializer for Role."""

    permissions = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False,
        help_text='Checked grid cells: [{"resource_id": "<uuid>", "action": "create"}].',
    )
    permission_matrix = serializers.SerializerMethodField()
    permissions_count = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = [
            "id",
            "name",
            "code",
            "description",
            "is_active",
            "permissions",
            "permission_matrix",
            "permissions_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "permission_matrix", "permissions_count", "created_at", "updated_at"]

    def validate_code(self, value):
        code = slugify(value)
        if not code:
            raise serializers.ValidationError("Code must contain at least one letter or number.")
        queryset = Role.objects.filter(code=code)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A role with this code already exists.")
        return code

    def validate_permissions(self, value):
        cells = []
        seen = set()
        for cell in value:
            resource_id = cell.get("resource_id")
            action = cell.get("action")
            if not resource_id or action not in CRUD_ACTIONS:
                raise serializers.ValidationError(
                    'Each permission must be {"resource_id": "<uuid>", "action": "<crud action>"}.'
                )
            key = (str(resource_id), action)
            if key in seen:
                continue
            seen.add(key)
            try:
                resource = Resource.objects.get(pk=resource_id, is_deleted=False)
            except Resource.DoesNotExist:
                raise serializers.ValidationError("Unknown or inactive resource.")
            cells.append((resource, action))
        return cells

    def get_permissions_count(self, obj):
        count = getattr(obj, "_permissions_count", None)
        if count is None:
            count = obj.permissions.count()
        return count

    def get_permission_matrix(self, obj):
        """Assigned cells only: {resource_id: {action: permission_id}}. Null when not requested."""
        if not self.context.get("include_matrix"):
            return None
        matrix = {}
        for perm in obj.permissions.all():
            resource_code = getattr(perm.resource, "code", "")
            suffix = f"-{resource_code}"
            if resource_code and perm.code.endswith(suffix):
                action = perm.code[: -len(suffix)]
                if action in CRUD_ACTIONS:
                    matrix.setdefault(str(perm.resource_id), {})[action] = str(perm.id)
        # Every resource key gets all four CRUD actions (unchecked = null) so
        # the frontend grid can render each cell without extra lookups.
        for resource_actions in matrix.values():
            for action in CRUD_ACTIONS:
                resource_actions.setdefault(action, None)
        return matrix
