from django.db import models
from cities_light.models import Country, Region
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("P", "Prefer not to say")
    ]

    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES
    )

    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    email = models.EmailField(unique=True)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, blank=True, null=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, blank=True, null=True)
    dob = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.email})"

class Post(models.Model):
    post = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, blank=False, null=False)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    comment = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comments")
    created_at = models.DateTimeField(auto_now_add=True)
