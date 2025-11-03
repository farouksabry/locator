from django.conf import settings
from django.core.mail import send_mail
from django.core.paginator import Paginator
from django.contrib.auth import authenticate
from django.middleware.csrf import get_token
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .models import User, Post, Comment
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from cities_light.models import Country, Region
from .serializers import UserSerializer, PostSerializer, CommentSerializer, RegisterSerializer, CountrySerializer, RegionSerializer, PasswordResetSerializer
from .tokens import EmailVerificationToken, PasswordResetToken

#Getting CSRF token
@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_csrf_token(request):
    return Response({"csrf_token": get_token(request)})

@api_view(['POST'])
def login_view(request):
    # Getting the credentials for logging in
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Try logging in
    user = authenticate(email=email, password=password)

    # If user successfully found
    if user is not None:
        user_serializer = UserSerializer(user)
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        response = Response({'message': "Login successful", "user": user_serializer.data}, status=status.HTTP_200_OK)

        # Setting access token in HttpOnly cookies
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=str(access),
            httponly=True,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        # Setting refresh token in HttpOnly cookies
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=str(refresh),
            httponly=True,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        return response
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request, slug):
    # Try getting the user to view the profile for that user
    try:
        user = User.objects.get(slug=slug)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)
    return Response(serializer.data)

# Register a new user
@api_view(['POST'])
def register_view(request):
    country = request.data.get("country")
    region = request.data.get("region")

    try:
        country = Country.objects.get(pk=country)
    except Country.DoesNotExist:
        return Response("Invalid country", status=status.HTTP_400_BAD_REQUEST)

    # If the user did not select a region and the selected country has region set
    if not region and country.region_set.count() != 0:
        return Response("Invalid region", status=status.HTTP_400_BAD_REQUEST)

    serializer = RegisterSerializer(data=request.data)

    # Register user
    if serializer.is_valid():
        user = serializer.save()
        token = EmailVerificationToken.for_user(user)
        verification_link = f"https://wheretofind.org/verify-email?token={token}"
        subject = "Verify your email"
        message = f"""
            Hi {user.first_name},
            
            Please click on the following link to verify your account:
            {verification_link}

            Thank you!
        """
        from_email = "noreply@wheretofind.org"
        recipient_list = [user.email]
        send_mail(subject, message, from_email, recipient_list, fail_silently=False,)
        return Response({"registered": True}, status=status.HTTP_201_CREATED)

    # If data is not valid
    error_messages = []
    for error in serializer.errors.values():
        error_messages.extend(error)

    return Response(error_messages, status=status.HTTP_400_BAD_REQUEST)

# View posts and create a new post
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def posts_view(request):
    # Retriecving posts related to the given region and country
    # Page number is being used in pagination
    if request.method == "GET":
        posts_country = request.query_params.get('country')
        posts_region = request.query_params.get('region')
        page_number = request.query_params.get('page_number')
        reset_posts = request.query_params.get('reset_posts')

        # If posts country and posts region are none
        if not posts_country:
            posts_country = request.user.country.id

            # If the user location already has region
            if request.user.region:
                posts_region = request.user.region.id

        if not page_number:
            page_number = 1

        # Check if location is being changed
        if reset_posts == "true":
            page_number = 1

        # Validate user input
        try:
            posts_country = Country.objects.get(pk=int(posts_country))
        except Country.DoesNotExist:
            return Response({"error": "Invalid country"}, status=status.HTTP_400_BAD_REQUEST)

        # If no region selected
        if not posts_region and posts_country.region_set.count() != 0:
            return Response({"error": "Invalid Region."}, status=status.HTTP_400_BAD_REQUEST)

        # If region is not None
        if posts_region:
            # Validate user input
            try:
                posts_region = Region.objects.get(pk=int(posts_region))
            except Region.DoesNotExist:
                return Response({"error": "Invalid region"}, status=status.HTTP_400_BAD_REQUEST)

            posts = Post.objects.filter(region=posts_region.id).order_by('-created_at')
        else:
            posts = Post.objects.filter(country=posts_country.id).order_by('-created_at')

        paginator = Paginator(posts, 10)

        serializer = PostSerializer(paginator.get_page(page_number), many=True)

        return Response({
            "pages_count": paginator.num_pages,
            "page_number": page_number,
            "posts": serializer.data,
            "posts_country": CountrySerializer(posts_country).data,
            "posts_region": RegionSerializer(posts_region).data,
        })

    # If a post request was made to save a new post
    # Get new post parameters
    post = request.data.get("post")
    country = request.data.get("country")
    user = request.data.get("user")

    # If data is missed
    if not post or not country or not user:
        return Response({"error": "Please complete your post data."}, status=status.HTTP_400_BAD_REQUEST)

    # Check that the authenticated user is the user who made the request
    if user != request.user.id:
        return Response({"error": "Unauthorized request."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        newPostCountry = Country.objects.get(pk=country)
    except Country.DoesNotExist:
        return Response({"error": "Invalid country."}, status=status.HTTP_400_BAD_REQUEST)

    if newPostCountry.region_set.count() != 0:
        region = request.data.get("region")

        if not region:
            return Response({"error": "Please select your region."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            newPostRegion = Region.objects.get(pk=region)
        except Region.DoesNotExist:
            return Response({"error": "Invalid region."}, status=status.HTTP_400_BAD_REQUEST)

        if not newPostCountry.region_set.filter(pk=newPostRegion.id):
            return Response({"error": "Invalid region."}, status=status.HTTP_400_BAD_REQUEST)

        # If a POST request was made, create a new post
        serializer = PostSerializer(data={"post": post, "country": country, "region": region})
    else:
        serializer = PostSerializer(data={"post": post, "country": country})

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # If invalid data
    return Response({"error": "Error creating a new post."}, status=status.HTTP_400_BAD_REQUEST)

# Return posts related to the current logged user to be viewed in profile
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_posts(request):
    if request.query_params.get("profile") and request.query_params.get("profile") == "true":
        page_number = request.query_params.get("page_number")

        if not page_number:
            page_number = 1
        else:
            page_number = int(page_number)

        posts = Post.objects.filter(user=request.user.id).order_by("-created_at")
        paginator = Paginator(posts, 10)
        posts_serializer = PostSerializer(paginator.get_page(page_number), many=True)

        return Response({
            "page_number": page_number,
            "pages_count": paginator.num_pages,
            "posts": posts_serializer.data,
        })

@api_view(['GET', 'DELETE', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def post_detail_view(request, id):
    # Getting specific post
    try:
        post = Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # If retrieving this post
    if request.method == "GET":
        serializer = PostSerializer(post)
        return Response(serializer.data)

    # If deleting this post
    if request.method == "DELETE":
        post.delete()
        return Response({"message": "Post deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    # Partial update for a post
    if request.method == "PATCH":
        serializer = PostSerializer(post, data=request.data, partial=True)

    # Full update for a post
    elif request.method == "PUT":
        serializer = PostSerializer(post, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    # If updating post
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# An end point to check whether the user is logged in or not
@api_view(['POST'])
def check_auth(request):
    raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

    if not raw_token:
        return Response({"logged": False}, status=status.HTTP_200_OK)

    try:
        acc_token = AccessToken(raw_token)
    except (TokenError, TypeError, InvalidToken):
        return Response({"logged": False}, status=status.HTTP_401_UNAUTHORIZED)

    user_serializer = UserSerializer(request.user)
    return Response({"logged": True, "user": user_serializer.data}, status=status.HTTP_200_OK)

# An end point to get all countries and regions
@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_countries_regions(request):
    countries = Country.objects.all()
    regions = Region.objects.all()    
    countries_serializers = CountrySerializer(countries, many=True)
    regions_serializers = RegionSerializer(regions, many=True)

    return Response({"countries": countries_serializers.data, "regions": regions_serializers.data}, status=status.HTTP_200_OK)

# An endpoint to refresh HTTPOnly cookie
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

    if not refresh_token:
        return Response({'error': 'No refresh token provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refresh = RefreshToken(refresh_token)
        response = Response({'message': 'Token Refreshed'}, status=status.HTTP_200_OK)

        # Set a new access token
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=str(refresh.access_token),
            httponly=True,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        # Set a new refresh token
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=str(refresh),
            httponly=True,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
        )

        return response
    except (TokenError, InvalidToken):
        return Response({'error': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@authentication_classes([])
def logout_view(request):
    response = Response({'detail': 'logged out'}, status=status.HTTP_200_OK)
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    return response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_view(request):
    post_id = request.data.get('post')
    comment = request.data.get('comment')
    user = request.data.get('user')

    if not post_id or not comment or not user:
        return Response({"error: Error adding comment."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        author = User.objects.get(pk=user)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    if author.id != request.user.id:
        return Response({'error': 'Unauthorized request.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

    comment_serializer = CommentSerializer(data=request.data)

    if comment_serializer.is_valid():
        comment_serializer.save(user=request.user)
        post_serializer = PostSerializer(post)
        return Response(post_serializer.data, status=status.HTTP_201_CREATED)

    return Response({'error': 'Error adding comment'}, status=status.HTTP_400_BAD_REQUEST)

# Email verification endpoint after registration
@api_view(['POST'])
def verify_email_view(request):
    # Email verification token
    token = request.data.get("token")

    if not token:
        return Response({"error": "Validation failed."}, status=status.HTTP_400_BAD_REQUEST)

    # Try validating email
    try:
        validation = EmailVerificationToken(token)
    except:
        return Response({"error": "Validation failed."}, status=status.HTTP_400_BAD_REQUEST)

    user_id = validation.payload.get("user_id")

    if not user_id:
        return Response({"error": "Validation failed."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "Validation failed."}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_active:
        user.is_active = True
        user.save()

    return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

# Password reset view
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def password_reset_view(request):
    # Check if the user changed the password
    if request.data.get("password"):
        # Check for password reset token
        token = request.data.get("token")

        # If no token exists
        if not token:
            return Response({"error": "Token missing."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the password reset token
        if not PasswordResetToken(token):
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        # Check for user id encoded in urlsafe_base64
        uidb64 = request.data.get("uid")

        # If no user id exists
        if not uidb64:
            return Response({"error": "User id does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Decode user id
        uid = urlsafe_base64_decode(uidb64).decode()

        # Try getting user data
        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Declare user
        password = request.data.get("password")

        serializer = PasswordResetSerializer(user, data={"password": password})

        # If is valid, update user password
        if serializer.is_valid():
            serializer.save()
            return Response({"message", "Password changed successfully."}, status=status.HTTP_200_OK)

        # Password reset failed
        return Response({"error": "Password reset failed."}, status=status.HTTP_400_BAD_REQUEST)

    email = request.data.get("email")

    if not email:
        return Response({"error": "Email missing."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"userFound": False}, status=status.HTTP_200_OK)

    token = PasswordResetToken.for_user(user)
    uidb64 = urlsafe_base64_encode(force_bytes(user.id))
    password_reset_link = f"http://localhost:5173/password-reset?uid={uidb64}&token={token}"
    subject = "Password Reset"
    message = f"""
        Hi {user.first_name},
        
        Please click on the following link to set a new password:
        {password_reset_link}

        Thank you!
    """
    from_email = "noreply@wheretofind.com"
    recipient_list = [user.email]
    send_mail(subject, message, from_email, recipient_list, fail_silently=False,)

    return Response({"userFound": True}, status=status.HTTP_200_OK)
