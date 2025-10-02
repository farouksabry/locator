from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        if not token:
            return None

        try:
            access_token = AccessToken(token)
            user_id = access_token.get('user_id')

            if not user_id:
                raise AuthenticationFailed("Invalid token: missing user_id")
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise AuthenticationFailed("User not found")

            return(user, None)
        except Exception:
            raise AuthenticationFailed("Invalid or expired token")
