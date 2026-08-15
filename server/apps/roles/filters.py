"""
apps/roles/filters.py
─────────────────────────────────────────────────────────────────────────────
FilterSet for the Role API.
─────────────────────────────────────────────────────────────────────────────
"""

import django_filters

from apps.roles.models import Role


class RoleFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_search")
    is_active = django_filters.BooleanFilter()

    class Meta:
        model = Role
        fields = ["is_active"]

    def filter_search(self, queryset, name, value):
        return queryset.search(value)
