"""
apps/resources/tests/test_resources_api.py
─────────────────────────────────────────────────────────────────────────────
API tests for the Resource CRUD endpoints.
─────────────────────────────────────────────────────────────────────────────
"""

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import CustomUser
from apps.authentication.models import UserRole
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


class TestResourceList:
    def test_list_returns_envelope_and_pagination(self, client, resource):
        response = client.get("/api/v1/resources/")
        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["success"] is True
        assert body["message"] == "OK"
        assert body["meta"]["total"] == 1
        assert body["errors"] is None
        assert body["data"][0]["name"] == "Patient Management"

    def test_list_filters_active(self, client, resource):
        Resource.objects.create(name="Inactive Module", code="inactive_module", is_active=False)
        response = client.get("/api/v1/resources/?is_active=true")
        assert response.json()["meta"]["total"] == 1

    def test_list_search(self, client, resource):
        response = client.get("/api/v1/resources/?search=patient")
        assert response.json()["meta"]["total"] == 1
        response = client.get("/api/v1/resources/?search=nope")
        assert response.json()["meta"]["total"] == 0

    def test_list_excludes_soft_deleted(self, client, resource):
        resource.soft_delete()
        response = client.get("/api/v1/resources/")
        assert response.json()["meta"]["total"] == 0


class TestResourceCreate:
    def test_create_success(self, client):
        response = client.post(
            "/api/v1/resources/",
            {"name": "Billing", "code": "billing", "description": "Invoices"},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        body = response.json()
        assert body["success"] is True
        assert body["message"] == "Created successfully."
        assert body["data"]["code"] == "billing"

    def test_create_duplicate_code_rejected(self, client, resource):
        response = client.post(
            "/api/v1/resources/",
            {"name": "Dupe", "code": "patient_management"},
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["success"] is False

    def test_create_slugs_code(self, client):
        response = client.post(
            "/api/v1/resources/",
            {"name": "Lab Results", "code": "Lab Results"},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["data"]["code"] == "lab-results"

    def test_create_requires_auth(self):
        response = APIClient().post("/api/v1/resources/", {"name": "X", "code": "x"}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestResourceDetail:
    def test_retrieve(self, client, resource):
        response = client.get(f"/api/v1/resources/{resource.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["data"]["code"] == "patient_management"

    def test_update(self, client, resource):
        response = client.patch(
            f"/api/v1/resources/{resource.id}/", {"is_active": False}, format="json"
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Updated successfully."
        assert response.json()["data"]["is_active"] is False

    def test_delete_soft_deletes(self, client, resource):
        response = client.delete(f"/api/v1/resources/{resource.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Deleted successfully."
        resource.refresh_from_db()
        assert resource.is_deleted is True
        assert Resource.objects.exclude(is_deleted=True).count() == 0