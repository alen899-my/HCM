"""
apps/permissions/serializers.py
─────────────────────────────────────────────────────────────────────────────
Permission API serializers.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework import serializers

from apps.permissions.models import Permission


class PermissionSerializer(serializers.ModelSerializer):
    """Full detail / list serializer for Permission."""

    resource_name = serializers.CharField(source="resource.name", read_only=True)
    resource_code = serializers.CharField(source="resource.code", read_only=True)

    class Meta:
        model = Permission
        fields = [
            "id",
            "resource",
            "resource_name",
            "resource_code",
            "name",
            "code",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "resource_name", "resource_code", "created_at", "updated_at"]

    def validate_code(self, value):
        from django.utils.text import slugify

        code = slugify(value)
        if not code:
            raise serializers.ValidationError("Code must contain at least one letter or number.")
        queryset = Permission.objects.filter(code=code)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A permission with this code already exists.")
        return code