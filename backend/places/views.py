from rest_framework import viewsets
from .models import Category, Place, PlaceSuggestion
from .serializers import CategorySerializer, PlaceSerializer, PlaceSuggestionSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer

    def get_queryset(self):
        from django.db.models import Q
        queryset = Place.objects.all()
        category_slug = self.request.query_params.get('category', None)
        search_query = self.request.query_params.get('search', None)
        
        if category_slug is not None:
            queryset = queryset.filter(category__slug=category_slug)
        if search_query is not None:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(description__icontains=search_query)
            )
        return queryset

class PlaceSuggestionViewSet(viewsets.ModelViewSet):
    queryset = PlaceSuggestion.objects.all()
    serializer_class = PlaceSuggestionSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
