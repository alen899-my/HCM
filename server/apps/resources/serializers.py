"""
apps/resources/serializers.py
─────────────────────────────────────────────────────────────────────────────
Resource API serializers.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework import serializers

from apps.resources.models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    """Full detail / list serializer for Resource."""

    parent_code = serializers.CharField(source="parent.code", read_only=True)
    children_count = serializers.IntegerField(source="children.count", read_only=True)

    class Meta:
        model = Resource
        fields = [
            "id",
            "name",
            "code",
            "description",
            "parent",
            "parent_code",
            "is_active",
            "children_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "parent_code", "children_count", "created_at", "updated_at"]

    def validate_code(self, value):
        from django.utils.text import slugify

        code = slugify(value)
        if not code:
            raise serializers.ValidationError("Code must contain at least one letter or number.")
        queryset = Resource.objects.filter(code=code)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A resource with this code already exists.")
        return code
