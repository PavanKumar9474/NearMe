from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Favorite, SearchHistory
from places.serializers import PlaceSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class FavoriteSerializer(serializers.ModelSerializer):
    place_details = PlaceSerializer(source='place', read_only=True)

    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ('user',)

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = '__all__'
        read_only_fields = ('user',)
