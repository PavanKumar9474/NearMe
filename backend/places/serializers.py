from rest_framework import serializers
from .models import Category, Place, PlaceSuggestion

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PlaceSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Place
        fields = '__all__'

class PlaceSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceSuggestion
        fields = '__all__'
