"""
apps/permissions/tests/test_permissions_api.py
─────────────────────────────────────────────────────────────────────────────
API tests for the Permission CRUD endpoints.
─────────────────────────────────────────────────────────────────────────────
"""

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import CustomUser
from apps.authentication.models import UserRole
from apps.permissions.models import Permission
from apps.resources.models import Resource

pytestmark = pytest.mark.django_db


@pytest.fixture
def user():
    return CustomUser.objects.create_user(emp_id="admin001", password="test1234", role=UserRole.ADMIN)


@pytest.fixture
def client(user):
    c = APIClient()
    c.force_authenticate(user=user)
    return c


@pytest.fixture
def resource():
    return Resource.objects.create(name="Patient Management", code="patient_management", is_active=True)


@pytest.fixture
def permission(resource):
    return Permission.objects.create(
        resource=resource,
        name="View Patient Records",
        code="view-patient-records",
        description="Read-only access to patient records.",
        is_active=True,
    )


class TestPermissionList:
    def test_list_returns_envelope_and_pagination(self, client, permission):
        response = client.get("/api/v1/permissions/")
        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["success"] is True
        assert body["message"] == "OK"
        assert body["meta"]["total"] == 1
        assert body["data"][0]["name"] == "View Patient Records"
        assert body["data"][0]["resource_name"] == "Patient Management"

    def test_list_filters_by_resource(self, client, permission, resource):
        other = Resource.objects.create(name="Billing", code="billing")
        Permission.objects.create(resource=other, name="Create Invoice", code="create-invoice")
        response = client.get(f"/api/v1/permissions/?resource={resource.id}")
        assert response.json()["meta"]["total"] == 1

    def test_list_filters_active(self, client, permission, resource):
        Permission.objects.create(resource=resource, name="Hidden", code="hidden", is_active=False)
        response = client.get("/api/v1/permissions/?is_active=true")
        assert response.json()["meta"]["total"] == 1

    def test_list_search(self, client, permission):
        response = client.get("/api/v1/permissions/?search=patient")
        assert response.json()["meta"]["total"] == 1
        response = client.get("/api/v1/permissions/?search=view-patient")
        assert response.json()["meta"]["total"] == 1
        response = client.get("/api/v1/permissions/?search=nope")
        assert response.json()["meta"]["total"] == 0

    def test_list_excludes_soft_deleted(self, client, permission):
        permission.soft_delete()
        response = client.get("/api/v1/permissions/")
        assert response.json()["meta"]["total"] == 0


class TestPermissionCreate:
    def test_create_success(self, client, resource):
        response = client.post(
            "/api/v1/permissions/",
            {
                "resource": str(resource.id),
                "name": "Register a Patient",
                "code": "Register a Patient",
                "description": "Create new patient profiles.",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        body = response.json()
        assert body["success"] is True
        assert body["message"] == "Created successfully."
        assert body["data"]["code"] == "register-a-patient"

    def test_create_duplicate_code_rejected(self, client, permission, resource):
        response = client.post(
            "/api/v1/permissions/",
            {"resource": str(resource.id), "name": "Dupe", "code": "view-patient-records"},
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["success"] is False

    def test_create_slugs_code(self, client, resource):
        response = client.post(
            "/api/v1/permissions/",
            {"resource": str(resource.id), "name": "Export Billing", "code": "Export Billing"},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["data"]["code"] == "export-billing"

    def test_create_requires_auth(self, resource):
        response = APIClient().post(
            "/api/v1/permissions/",
            {"resource": str(resource.id), "name": "X", "code": "x"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestPermissionDetail:
    def test_retrieve(self, client, permission):
        response = client.get(f"/api/v1/permissions/{permission.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["data"]["code"] == "view-patient-records"

    def test_update(self, client, permission):
        response = client.patch(
            f"/api/v1/permissions/{permission.id}/", {"is_active": False}, format="json"
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Updated successfully."
        assert response.json()["data"]["is_active"] is False

    def test_delete_soft_deletes(self, client, permission):
        response = client.delete(f"/api/v1/permissions/{permission.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Deleted successfully."
        permission.refresh_from_db()
        assert permission.is_deleted is True
        assert Permission.objects.exclude(is_deleted=True).count() == 0