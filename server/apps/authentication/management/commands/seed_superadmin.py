"""
apps/authentication/management/commands/seed_superadmin.py
─────────────────────────────────────────────────────────────────────────────
Management command to seed the default superadmin user.
Usage:
  python manage.py seed_superadmin
─────────────────────────────────────────────────────────────────────────────
"""

from django.core.management.base import BaseCommand
from apps.authentication.models import CustomUser, UserRole


class Command(BaseCommand):
    help = "Seeds the default superadmin user into the database."

    SUPERADMIN_EMP_ID  = "superadmin"
    SUPERADMIN_PASSWORD = "123456"

    def handle(self, *args, **options):
        self.stdout.write("Seeding superadmin user...")

        user, created = CustomUser.objects.get_or_create(
            emp_id=self.SUPERADMIN_EMP_ID,
            defaults={
                "first_name":    "Super",
                "last_name":     "Admin",
                "role":          UserRole.SUPERADMIN,
                "is_active":     True,
                "is_staff":      True,
                "is_superuser":  True,
            },
        )

        if created:
            user.set_password(self.SUPERADMIN_PASSWORD)
            user.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"[OK] Superadmin created: emp_id='{self.SUPERADMIN_EMP_ID}' password='{self.SUPERADMIN_PASSWORD}'"
                )
            )
        else:
            # Always reset password on re-run so it stays at known value
            user.set_password(self.SUPERADMIN_PASSWORD)
            user.role         = UserRole.SUPERADMIN
            user.is_staff     = True
            user.is_superuser = True
            user.is_active    = True
            user.save()
            self.stdout.write(
                self.style.WARNING(
                    f"[UPDATED] Superadmin already exists. Password reset to '{self.SUPERADMIN_PASSWORD}'"
                )
            )
