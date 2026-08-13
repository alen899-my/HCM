"""
apps/authentication/views.py
─────────────────────────────────────────────────────────────────────────────
Authentication views:
  - LoginView       POST /api/v1/auth/login/
  - LogoutView      POST /api/v1/auth/logout/
  - TokenRefreshView POST /api/v1/auth/refresh/
  - MeView          GET  /api/v1/auth/me/
─────────────────────────────────────────────────────────────────────────────
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from apps.authentication.serializers import LoginSerializer, UserSerializer


def _token_pair(user):
    """Generate access + refresh JWT tokens for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        "access":  str(refresh.access_token),
        "refresh": str(refresh),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """
    POST /api/v1/auth/login/
    Body: { "emp_id": "superadmin", "password": "123456" }
    Returns: tokens + user profile
    """
    serializer = LoginSerializer(data=request.data, context={"request": request})

    if not serializer.is_valid():
        return Response({
            "success": False,
            "data":    None,
            "message": "Invalid credentials.",
            "errors":  serializer.errors,
            "meta":    None,
        }, status=status.HTTP_401_UNAUTHORIZED)

    user   = serializer.validated_data["user"]
    tokens = _token_pair(user)

    return Response({
        "success": True,
        "data": {
            "user":   UserSerializer(user).data,
            "tokens": tokens,
        },
        "message": "Login successful.",
        "errors":  None,
        "meta":    None,
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    POST /api/v1/auth/logout/
    Body: { "refresh": "<refresh_token>" }
    Blacklists the refresh token.
    """
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({
            "success": False,
            "data":    None,
            "message": "Refresh token is required.",
            "errors":  {"refresh": ["This field is required."]},
            "meta":    None,
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except TokenError as exc:
        return Response({
            "success": False,
            "data":    None,
            "message": str(exc),
            "errors":  None,
            "meta":    None,
        }, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "success": True,
        "data":    None,
        "message": "Logged out successfully.",
        "errors":  None,
        "meta":    None,
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    GET /api/v1/auth/me/
    Returns the authenticated user's profile.
    """
    return Response({
        "success": True,
        "data":    UserSerializer(request.user).data,
        "message": "OK",
        "errors":  None,
        "meta":    None,
    })
