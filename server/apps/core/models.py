"""
apps/core/models.py
─────────────────────────────────────────────────────────────────────────────
Base abstract models — all domain models should inherit from these.
─────────────────────────────────────────────────────────────────────────────
"""

import uuid

from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model that automatically tracks created_at and updated_at.
    All HSM models should inherit from this.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class UUIDModel(models.Model):
    """
    Abstract base model that uses UUID as the primary key.
    Use for patient-facing entities to avoid sequential ID enumeration.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """
    Abstract base model that supports soft deletion.
    Records are never physically deleted — is_deleted flag is toggled.
    """

    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def soft_delete(self):
        """Mark the record as deleted without removing it from the DB."""
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_at"])

    def restore(self):
        """Restore a soft-deleted record."""
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=["is_deleted", "deleted_at"])


class BaseModel(UUIDModel, TimeStampedModel, SoftDeleteModel):
    """
    Convenience base model combining UUID PK + timestamps + soft delete.
    The recommended base for all core domain entities.
    """

    class Meta:
        abstract = True
        ordering = ["-created_at"]
