from django.contrib import admin

from apps.roles.models import Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "permission_count", "is_active", "is_deleted", "created_at"]
    list_filter = ["is_active", "is_deleted"]
    search_fields = ["name", "code", "description"]
    readonly_fields = ["created_at", "updated_at", "deleted_at"]
    filter_horizontal = ["permissions"]

    @admin.display(description="Permissions")
    def permission_count(self, obj):
        return obj.permissions.count()
