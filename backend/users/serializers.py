from rest_framework import serializers
from .models import User, SearchHistory, Favorite
from places.serializers import PlaceSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    place = PlaceSerializer(read_only=True)
    place_id = serializers.PrimaryKeyRelatedField(
        queryset=PlaceSerializer.Meta.model.objects.all(), source='place', write_only=True
    )

    class Meta:
        model = Favorite
        fields = '__all__'
