"""
apps/authentication/serializers.py
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.authentication.models import CustomUser


class LoginSerializer(serializers.Serializer):
    emp_id   = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, data):
        emp_id   = data.get("emp_id", "").strip()
        password = data.get("password", "")

        if not emp_id or not password:
            raise serializers.ValidationError("Employee ID and password are required.")

        user = authenticate(
            request=self.context.get("request"),
            emp_id=emp_id,
            password=password,
        )

        if not user:
            raise serializers.ValidationError("Invalid Employee ID or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account has been deactivated.")

        data["user"] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model  = CustomUser
        fields = ["id", "emp_id", "first_name", "last_name", "email", "role", "full_name", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]
