"""
apps/authentication/models.py
─────────────────────────────────────────────────────────────────────────────
CustomUser model — uses emp_id as the unique identifier for login.
Extends AbstractBaseUser for full control over auth fields.
─────────────────────────────────────────────────────────────────────────────
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserRole(models.TextChoices):
    SUPERADMIN      = "superadmin",      "Super Admin"
    ADMIN           = "admin",           "Admin"
    DOCTOR          = "doctor",          "Doctor"
    NURSE           = "nurse",           "Nurse"
    RECEPTIONIST    = "receptionist",    "Receptionist"
    PATIENT         = "patient",         "Patient"
    PHARMACIST      = "pharmacist",      "Pharmacist"
    LAB_TECHNICIAN  = "lab_technician",  "Lab Technician"


class CustomUserManager(BaseUserManager):
    def create_user(self, emp_id, password=None, **extra_fields):
        if not emp_id:
            raise ValueError("Employee ID is required.")
        user = self.model(emp_id=emp_id.strip(), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, emp_id, password=None, **extra_fields):
        extra_fields.setdefault("role", UserRole.SUPERADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(emp_id, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Hospital Management System user.
    Login identifier: emp_id (Employee ID).
    """

    emp_id      = models.CharField(max_length=50, unique=True, db_index=True)
    first_name  = models.CharField(max_length=150, blank=True)
    last_name   = models.CharField(max_length=150, blank=True)
    email       = models.EmailField(blank=True, null=True)
    role        = models.CharField(max_length=30, choices=UserRole.choices, default=UserRole.RECEPTIONIST)

    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD  = "emp_id"
    REQUIRED_FIELDS = []

    class Meta:
        db_table    = "users"
        verbose_name        = "User"
        verbose_name_plural = "Users"
        ordering = ["emp_id"]

    def __str__(self):
        return f"{self.emp_id} ({self.get_role_display()})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.emp_id
