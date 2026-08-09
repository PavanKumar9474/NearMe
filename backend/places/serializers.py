from rest_framework import serializers
from .models import Category, Place, PlaceSuggestion

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PlaceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    distance_km = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Place
        fields = '__all__'

class PlaceSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceSuggestion
        fields = '__all__'
        read_only_fields = ('user', 'status', 'reviewed_at')
