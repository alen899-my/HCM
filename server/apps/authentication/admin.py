"""
apps/authentication/admin.py
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.authentication.models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display    = ["emp_id", "full_name", "role", "is_active", "is_staff", "created_at"]
    list_filter     = ["role", "is_active", "is_staff"]
    search_fields   = ["emp_id", "first_name", "last_name", "email"]
    ordering        = ["emp_id"]

    fieldsets = (
        (None,           {"fields": ("emp_id", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "email")}),
        ("Role",          {"fields": ("role",)}),
        ("Permissions",   {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Timestamps",    {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields":  ("emp_id", "password1", "password2", "role", "first_name", "last_name"),
        }),
    )

    readonly_fields = ["created_at", "updated_at"]
