"""
apps/permissions/admin.py
─────────────────────────────────────────────────────────────────────────────
Django admin registration for Permission.
─────────────────────────────────────────────────────────────────────────────
"""

from django.contrib import admin

from apps.permissions.models import Permission


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "resource", "is_active", "is_deleted", "created_at"]
    list_filter = ["is_active", "is_deleted", "resource"]
    search_fields = ["name", "code", "resource__name", "resource__code"]
    readonly_fields = ["id", "created_at", "updated_at", "deleted_at"]