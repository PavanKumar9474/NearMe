from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Category, Place, PlaceSuggestion, Review
from .serializers import CategorySerializer, PlaceSerializer, PlaceSuggestionSerializer, ReviewSerializer
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
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
        min_rating = self.request.query_params.get('min_rating', None)
        sort_by = self.request.query_params.get('sort_by', None)
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(description__icontains=search_query)
            )
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except ValueError:
                pass
                
        if sort_by == 'rating':
            queryset = queryset.order_by('-rating')
            
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        user_lat = request.query_params.get('user_lat')
        user_lon = request.query_params.get('user_lon')
        radius = request.query_params.get('radius')
        sort_by = request.query_params.get('sort_by')

        if user_lat and user_lon:
            try:
                user_lat = float(user_lat)
                user_lon = float(user_lon)

                places = []
                for place in queryset:
                    place.distance_km = round(haversine(user_lat, user_lon, float(place.latitude), float(place.longitude)), 2)
                    
                    if radius:
                        if place.distance_km <= float(radius):
                            places.append(place)
                    else:
                        places.append(place)
                
                if sort_by == 'distance':
                    places.sort(key=lambda x: getattr(x, 'distance_km', float('inf')))

                page = self.paginate_queryset(places)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)

                serializer = self.get_serializer(places, many=True)
                return Response(serializer.data)
            except ValueError:
                pass

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        # A smart algorithm to recommend top-rated places
        # In a real app, this would use AI or look at user preferences
        # Here we just fetch the top 3 highest rated places
        queryset = Place.objects.filter(rating__isnull=False).order_by('-rating')[:3]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PlaceSuggestionViewSet(viewsets.ModelViewSet):
    queryset = PlaceSuggestion.objects.all()
    serializer_class = PlaceSuggestionSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        place_id = self.request.query_params.get('place', None)
        if place_id is not None:
            queryset = queryset.filter(place_id=place_id)
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
