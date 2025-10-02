from rest_framework import serializers
from .models import User, Post, Comment
from cities_light.models import Country, Region

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'comment', 'post', 'user', 'created_at']
        read_only_fields = ['user']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'gender', 'dob', 'country', 'region']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(source='post_comments', many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'post', 'user', 'country', 'region', 'comments', 'created_at']
        read_only_fields = ['user']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'
