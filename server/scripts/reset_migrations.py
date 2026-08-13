"""
Fixes the InconsistentMigrationHistory error that happens when CustomUser
is added after initial Django migrations have already been applied.

Clears all migration records from django_migrations and drops/recreates all
Django-managed tables, then re-runs migrate fresh.
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

import django
django.setup()

from django.db import connection

APPS_TO_CLEAR = ("admin", "auth", "contenttypes", "sessions", "token_blacklist", "authentication")

with connection.cursor() as cursor:
    # Drop migration records for affected apps
    placeholders = ", ".join(["%s"] * len(APPS_TO_CLEAR))
    cursor.execute(
        f"DELETE FROM django_migrations WHERE app IN ({placeholders});",
        APPS_TO_CLEAR,
    )
    print(f"Cleared migration records for: {APPS_TO_CLEAR}")

    # Drop auth tables that already exist (they'll be recreated by migrate)
    tables_to_drop = [
        "token_blacklist_blacklistedtoken",
        "token_blacklist_outstandingtoken",
        "django_admin_log",
        "auth_user_groups",
        "auth_user_user_permissions",
        "auth_user",
        "auth_permission",
        "auth_group_permissions",
        "auth_group",
        "django_session",
        "django_content_type",
    ]
    for table in tables_to_drop:
        try:
            cursor.execute(f'DROP TABLE IF EXISTS "{table}" CASCADE;')
            print(f"  Dropped table: {table}")
        except Exception as e:
            print(f"  Skipped {table}: {e}")

print("\nDatabase reset complete. Now run: python manage.py migrate")
