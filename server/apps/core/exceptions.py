"""
apps/core/exceptions.py
─────────────────────────────────────────────────────────────────────────────
Custom DRF exception handler that wraps all responses in the standard envelope:
{
  "success": false,
  "data":    null,
  "message": "<short description>",
  "errors":  { ... }
}
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """
    Wraps DRF's default exception handler output in the HSM standard envelope.
    """
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "success": False,
            "data": None,
            "message": _get_message(response.data),
            "errors": response.data,
            "meta": None,
        }

    return response


def _get_message(data) -> str:
    """Extract a human-readable message from DRF error data."""
    if isinstance(data, dict):
        # Common DRF keys
        for key in ("detail", "non_field_errors"):
            if key in data:
                val = data[key]
                return str(val[0]) if isinstance(val, list) else str(val)
        # First field error
        first_key = next(iter(data))
        val = data[first_key]
        return f"{first_key}: {val[0]}" if isinstance(val, list) else f"{first_key}: {val}"
    if isinstance(data, list) and data:
        return str(data[0])
    return "An error occurred."
