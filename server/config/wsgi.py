"""
config/wsgi.py
─────────────────────────────────────────────────────────────────────────────
WSGI config for Hospital Management System.
Exposes the WSGI callable as module-level 'application' variable.
─────────────────────────────────────────────────────────────────────────────
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

application = get_wsgi_application()
