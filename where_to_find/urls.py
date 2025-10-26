from django.urls import path, include
from rest_framework import routers
from . import api

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('token/refresh/', api.refresh_token_view, name='token_refresh'),
    path('login/', api.login_view, name='login'),
    path('register/', api.register_view, name='register'),
    path('logout/', api.logout_view, name='logout'),
    path('profile/<slug:slug>/', api.profile_view, name='profile'),
    path('posts/', api.posts_view, name='posts'),
    path('posts/profile/', api.profile_posts, name='profile_posts'),
    path('posts/<int:id>/', api.post_detail_view, name='post-detail'),
    path('csrf/', api.get_csrf_token, name='csrf'),
    path('check-auth/', api.check_auth, name='check-auth'),
    path('countries-cities/', api.get_countries_regions, name="get-countries-cities"),
    path('comment/', api.comment_view, name="comments"),
    path('verify-email/', api.verify_email_view, name="verify-email"),
    path('password-reset/', api.password_reset_view, name="password-reset"),
]
