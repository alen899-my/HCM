"""
apps/core/serializers.py
─────────────────────────────────────────────────────────────────────────────
Base serializer mixin and standard response helpers.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework import serializers


class TimestampedSerializer(serializers.ModelSerializer):
    """
    Base serializer that always includes created_at and updated_at as ISO-8601.
    """

    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
