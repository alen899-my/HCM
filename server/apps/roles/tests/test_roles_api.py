"""
apps/roles/tests/test_roles_api.py
─────────────────────────────────────────────────────────────────────────────
API tests for the Role CRUD endpoints + permission grid sync.
─────────────────────────────────────────────────────────────────────────────
"""

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from apps.authentication.models import CustomUser
from apps.authentication.models import UserRole
from apps.permissions.models import Permission
from apps.resources.models import Resource
from apps.roles.models import Role

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
    return Resource.objects.create(name="Patient Management", code="patient-management", is_active=True)


@pytest.fixture
def role(resource):
    role = Role.objects.create(name="Doctor", code="Doctor", description="Treats patients.")
    read_perm = Permission.objects.create(
        resource=resource, name="View Patient Management", code="read-patient-management"
    )
    role.permissions.set([read_perm])
    return role


class TestRoleList:
    def test_list_returns_envelope_and_pagination(self, client, role):
        response = client.get("/api/v1/roles/")
        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["success"] is True
        assert body["meta"]["total"] == 1
        assert body["data"][0]["name"] == "Doctor"
        assert body["data"][0]["permissions_count"] == 1

    def test_list_filters_active(self, client, role):
        Role.objects.create(name="Inactive Role", code="inactive-role", is_active=False)
        response = client.get("/api/v1/roles/?is_active=true")
        assert response.json()["meta"]["total"] == 1

    def test_list_search(self, client, role):
        response = client.get("/api/v1/roles/?search=doctor")
        assert response.json()["meta"]["total"] == 1
        response = client.get("/api/v1/roles/?search=nope")
        assert response.json()["meta"]["total"] == 0

    def test_list_excludes_soft_deleted(self, client, role):
        role.soft_delete()
        response = client.get("/api/v1/roles/")
        assert response.json()["meta"]["total"] == 0


class TestRoleCreate:
    def test_create_with_permission_cells_provisions_permissions(self, client, resource):
        response = client.post(
            "/api/v1/roles/",
            {
                "name": "Doctor",
                "code": "Doctor",
                "description": "Treats patients.",
                "permissions": [
                    {"resource_id": str(resource.id), "action": "create"},
                    {"resource_id": str(resource.id), "action": "read"},
                ],
            },
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        body = response.json()
        assert body["data"]["code"] == "doctor"
        role = Role.objects.get(name="Doctor")
        assert role.permissions.count() == 2
        codes = set(role.permissions.values_list("code", flat=True))
        assert codes == {"create-patient-management", "read-patient-management"}

    def test_create_unknown_resource_rejected(self, client):
        response = client.post(
            "/api/v1/roles/",
            {"name": "Doctor", "code": "doctor", "permissions": [{"resource_id": "00000000-0000-0000-0000-000000000000", "action": "read"}]},
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_invalid_action_rejected(self, client, resource):
        response = client.post(
            "/api/v1/roles/",
            {"name": "Doctor", "code": "doctor", "permissions": [{"resource_id": str(resource.id), "action": "hack"}]},
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_duplicate_code_rejected(self, client, role):
        response = client.post(
            "/api/v1/roles/", {"name": "Physician", "code": "doctor"}, format="json"
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["success"] is False

    def test_create_slugs_code(self, client):
        response = client.post(
            "/api/v1/roles/", {"name": "Head Nurse", "code": "Head Nurse"}, format="json"
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["data"]["code"] == "head-nurse"

    def test_create_requires_auth(self):
        response = APIClient().post("/api/v1/roles/", {"name": "X", "code": "x"}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_roles_share_provisioned_permissions(self, client, resource):
        payload = {
            "name": "Doctor",
            "code": "doctor",
            "permissions": [{"resource_id": str(resource.id), "action": "read"}],
        }
        client.post("/api/v1/roles/", payload, format="json")
        client.post("/api/v1/roles/", {**payload, "name": "Nurse", "code": "nurse"}, format="json")
        assert Permission.objects.filter(code="read-patient-management").count() == 1


class TestRoleDetail:
    def test_retrieve_includes_permission_matrix(self, client, role, resource):
        response = client.get(f"/api/v1/roles/{role.id}/")
        assert response.status_code == status.HTTP_200_OK
        body = response.json()["data"]
        matrix = body["permission_matrix"]
        assert matrix[str(resource.id)]["read"] is not None
        assert matrix[str(resource.id)]["create"] is None

    def test_list_omits_permission_matrix(self, client, role):
        response = client.get("/api/v1/roles/")
        assert response.json()["data"][0]["permission_matrix"] is None

    def test_update_syncs_permissions(self, client, role, resource):
        response = client.patch(
            f"/api/v1/roles/{role.id}/",
            {"permissions": [{"resource_id": str(resource.id), "action": "delete"}]},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        role.refresh_from_db()
        assert set(role.permissions.values_list("code", flat=True)) == {"delete-patient-management"}

    def test_update_clears_permissions_with_empty_list(self, client, role):
        response = client.patch(f"/api/v1/roles/{role.id}/", {"permissions": []}, format="json")
        assert response.status_code == status.HTTP_200_OK
        role.refresh_from_db()
        assert role.permissions.count() == 0

    def test_update_partial_without_permissions_keeps_them(self, client, role):
        response = client.patch(f"/api/v1/roles/{role.id}/", {"description": "Changed."}, format="json")
        assert response.status_code == status.HTTP_200_OK
        role.refresh_from_db()
        assert role.permissions.count() == 1
        assert role.description == "Changed."

    def test_delete_soft_deletes(self, client, role):
        response = client.delete(f"/api/v1/roles/{role.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Deleted successfully."
        role.refresh_from_db()
        assert role.is_deleted is True
        assert Role.objects.exclude(is_deleted=True).count() == 0
