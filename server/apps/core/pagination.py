"""
apps/core/pagination.py
─────────────────────────────────────────────────────────────────────────────
Custom pagination class that wraps responses in the HSM standard envelope.
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "success": True,
            "data": data,
            "message": "OK",
            "errors": None,
            "meta": {
                "total":    self.page.paginator.count,
                "page":     self.page.number,
                "pages":    self.page.paginator.num_pages,
                "has_next": self.get_next_link() is not None,
                "has_prev": self.get_previous_link() is not None,
            },
        })

    def get_paginated_response_schema(self, schema):
        return {
            "type": "object",
            "properties": {
                "success": {"type": "boolean"},
                "data":    schema,
                "message": {"type": "string"},
                "errors":  {"type": "object", "nullable": True},
                "meta":    {
                    "type": "object",
                    "properties": {
                        "total":    {"type": "integer"},
                        "page":     {"type": "integer"},
                        "pages":    {"type": "integer"},
                        "has_next": {"type": "boolean"},
                        "has_prev": {"type": "boolean"},
                    },
                },
            },
        }
