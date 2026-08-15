"""
apps/roles/models.py
─────────────────────────────────────────────────────────────────────────────
RBAC Role model — the third entity of the permission system.

A Role groups Permissions and is what gets assigned to users. Permission
grants are collected through an industry-standard CRUD checkbox grid
(rows = resources, columns = create / read / update / delete). Each checked
cell maps to a Permission whose code follows the convention:

    f"{action}-{resource.code}"   e.g. "create-patient-management"

This lets the role save flow auto-provision permissions on demand while
reusing any permission that already exists with the same convention code.
─────────────────────────────────────────────────────────────────────────────
"""

from django.db import models
from django.utils.text import slugify

from apps.core.models import BaseModel

# Industry-standard CRUD actions for the role permission grid.
CRUD_ACTIONS = {
    "create": "Add",
    "read": "View",
    "update": "Edit",
    "delete": "Delete",
}


class RoleQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True, is_deleted=False)

    def search(self, term):
        return self.filter(
            models.Q(name__icontains=term)
            | models.Q(code__icontains=term)
            | models.Q(description__icontains=term)
        )


class Role(BaseModel):
    """A named, human-understandable group of permissions."""

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Human-readable role name, e.g. 'Doctor', 'Nurse', 'Receptionist'.",
    )
    code = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        help_text="Stable machine identifier used in role checks (auto-slugged).",
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    permissions = models.ManyToManyField(
        "permissions.Permission",
        related_name="roles",
        blank=True,
        help_text="Permissions granted to this role.",
    )

    objects = RoleQuerySet.as_manager()

    class Meta:
        db_table = "roles"
        verbose_name = "Role"
        verbose_name_plural = "Roles"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.code = slugify(self.code)
        super().save(*args, **kwargs)

    @staticmethod
    def permission_code(resource_code, action):
        """Convention code for the permission covering (resource, action)."""
        return f"{action}-{slugify(resource_code)}"
