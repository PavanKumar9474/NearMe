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
        import os
        import google.generativeai as genai
        import json
        from django.db.models import Case, When
        
        api_key = os.getenv("GEMINI_API_KEY")
        user_preferences = request.query_params.get("preferences", "")
        
        # Fallback if no API key or no preferences
        if not api_key:
            queryset = Place.objects.filter(rating__isnull=False).order_by('-rating')[:3]
            serializer = self.get_serializer(queryset, many=True)
            return Response({"ai_powered": False, "data": serializer.data, "message": "Showing top rated places (No AI API Key provided)."})
            
        genai.configure(api_key=api_key)
        
        places = Place.objects.filter(is_active=True)
        places_data = [{"id": p.id, "name": p.name, "category": p.category.name, "description": p.description, "rating": float(p.rating) if p.rating else 0.0} for p in places]
        
        prompt = f"""
        Given the following list of places in JSON format:
        {json.dumps(places_data)}
        
        And the user's preferences: "{user_preferences or 'I want to explore nice places around.'}"
        
        Please select the top 3 best places for this user. 
        Return ONLY a JSON array of the recommended place IDs (e.g., [1, 5, 2]). Do not include any other text, reasoning, or markdown formatting.
        """
        
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            
            recommended_ids_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            recommended_ids = json.loads(recommended_ids_text)
            
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(recommended_ids)])
            queryset = Place.objects.filter(id__in=recommended_ids).order_by(preserved)
            serializer = self.get_serializer(queryset, many=True)
            
            return Response({"ai_powered": True, "data": serializer.data, "message": "AI picked these just for you!"})
        except Exception as e:
            # Fallback
            queryset = Place.objects.filter(rating__isnull=False).order_by('-rating')[:3]
            serializer = self.get_serializer(queryset, many=True)
            return Response({"ai_powered": False, "data": serializer.data, "message": f"AI error, showing top rated places. Error: {str(e)}"})

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
