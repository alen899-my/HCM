"""
apps/resources/filters.py
─────────────────────────────────────────────────────────────────────────────
FilterSet for the Resource API.
─────────────────────────────────────────────────────────────────────────────
"""

import django_filters

from apps.resources.models import Resource


class ResourceFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search")
    is_active = django_filters.BooleanFilter()
    parent = django_filters.UUIDFilter(field_name="parent_id")

    class Meta:
        model = Resource
        fields = ["is_active", "parent"]

    def filter_search(self, queryset, name, value):
        return queryset.search(value)
