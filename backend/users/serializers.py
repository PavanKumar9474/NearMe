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
