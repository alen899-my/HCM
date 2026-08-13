"""
apps/resources/models.py
─────────────────────────────────────────────────────────────────────────────
RBAC Resource model — the first entity of the permission system.

A Resource represents a system module/sub-module (e.g. "Patient Management",
"Billing") that permissions will be scoped to in later RBAC phases.
─────────────────────────────────────────────────────────────────────────────
"""

from django.db import models
from django.utils.text import slugify

from apps.core.models import BaseModel


class ResourceQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True, is_deleted=False)

    def roots(self):
        return self.filter(parent__isnull=True)

    def search(self, term):
        return self.filter(
            models.Q(name__icontains=term) | models.Q(code__icontains=term)
        )


class Resource(BaseModel):
    """
    A system resource (module / sub-module) protected by RBAC.

    Fields:
        name        — display name shown in UI
        code        — stable, unique machine identifier used in permission
                      checks (e.g. "patient_management")
        description — optional human-readable explanation
        parent      — optional self-FK for hierarchical module trees
        is_active   — soft enable/disable without deleting
    """

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="children",
    )
    is_active = models.BooleanField(default=True)

    objects = ResourceQuerySet.as_manager()

    class Meta:
        db_table = "resources"
        verbose_name = "Resource"
        verbose_name_plural = "Resources"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.code = slugify(self.code)
        super().save(*args, **kwargs)
