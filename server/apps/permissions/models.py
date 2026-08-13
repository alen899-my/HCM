"""
apps/permissions/models.py
─────────────────────────────────────────────────────────────────────────────
RBAC Permission model — the second entity of the permission system.

A Permission scopes a named capability to a Resource, e.g.
"View Patient Records" under the "Patient Management" module.
Roles will be granted these permissions in a later RBAC phase.
─────────────────────────────────────────────────────────────────────────────
"""

from django.db import models
from django.utils.text import slugify

from apps.core.models import BaseModel
from apps.resources.models import Resource


class PermissionQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True, is_deleted=False)

    def for_resource(self, resource):
        return self.filter(resource=resource)

    def search(self, term):
        return self.filter(
            models.Q(name__icontains=term)
            | models.Q(code__icontains=term)
            | models.Q(description__icontains=term)
            | models.Q(resource__name__icontains=term)
            | models.Q(resource__code__icontains=term)
        )


class Permission(BaseModel):
    """A named capability scoped to a system resource."""

    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="permissions",
        help_text="The system module/sub-module this permission applies to.",
    )
    name = models.CharField(
        max_length=100,
        help_text="Display name shown in permission assignment screens.",
    )
    code = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        help_text="Stable machine identifier used in permission checks.",
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    objects = PermissionQuerySet.as_manager()

    class Meta:
        db_table = "permissions"
        verbose_name = "Permission"
        verbose_name_plural = "Permissions"
        ordering = ["resource__name", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.code = slugify(self.code)
        super().save(*args, **kwargs)