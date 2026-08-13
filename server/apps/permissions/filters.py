"""
apps/permissions/filters.py
─────────────────────────────────────────────────────────────────────────────
FilterSet for the Permission API.
─────────────────────────────────────────────────────────────────────────────
"""

import django_filters

from apps.permissions.models import Permission


class PermissionFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search")
    resource = django_filters.UUIDFilter(field_name="resource_id")
    is_active = django_filters.BooleanFilter()

    class Meta:
        model = Permission
        fields = ["resource", "is_active"]

    def filter_search(self, queryset, name, value):
        return queryset.search(value)