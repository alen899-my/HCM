"""
apps/resources/admin.py
─────────────────────────────────────────────────────────────────────────────
Django admin registration for Resource.
─────────────────────────────────────────────────────────────────────────────
"""

from django.contrib import admin

from apps.resources.models import Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "parent", "is_active", "is_deleted", "created_at"]
    list_filter = ["is_active", "is_deleted", "parent"]
    search_fields = ["name", "code"]
    readonly_fields = ["id", "created_at", "updated_at", "deleted_at"]
