"""
config/asgi.py
─────────────────────────────────────────────────────────────────────────────
ASGI config for Hospital Management System.
Exposes the ASGI callable as module-level 'application' variable.
─────────────────────────────────────────────────────────────────────────────
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

application = get_asgi_application()
