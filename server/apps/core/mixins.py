"""
apps/core/mixins.py
─────────────────────────────────────────────────────────────────────────────
Reusable OOP mixins for DRF ViewSets.

- EnvelopeResponseMixin: wraps every viewset response in the HSM standard
  envelope { success, data, message, errors, meta }.
- SoftDeleteMixin: turns ModelViewSet's destroy() into a soft delete using
  SoftDeleteModel.soft_delete().

All RBAC / domain ViewSets should inherit from these to keep API responses
uniform without repeating response-shaping code.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework import status
from rest_framework.response import Response

from apps.core.pagination import StandardPagination


class EnvelopeResponseMixin:
    """
    Wraps ViewSet responses in the HSM standard envelope:

        { "success": bool, "data": ..., "message": str, "errors": null, "meta": null }

    The paginated list() already returns an envelope via StandardPagination,
    so only the single-object actions (create / retrieve / update) and
    destroy() need wrapping here.
    """

    pagination_class = StandardPagination

    @staticmethod
    def _ok(data, message="OK", meta=None, http_status=status.HTTP_200_OK):
        return Response(
            {
                "success": True,
                "data": data,
                "message": message,
                "errors": None,
                "meta": meta,
            },
            status=http_status,
        )

    @staticmethod
    def _error(message="An error occurred.", errors=None, http_status=status.HTTP_400_BAD_REQUEST):
        return Response(
            {
                "success": False,
                "data": None,
                "message": message,
                "errors": errors,
                "meta": None,
            },
            status=http_status,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return self._ok(
            serializer.data,
            message="Created successfully.",
            http_status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self._ok(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return self._ok(serializer.data, message="Updated successfully.")


class SoftDeleteMixin:
    """
    Overrides ModelViewSet.destroy() to use SoftDeleteModel.soft_delete()
    instead of a physical DELETE. Returns a standard envelope response.
    """

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return self._ok(None, message="Deleted successfully.")