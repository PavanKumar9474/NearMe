from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Place, Review

User = get_user_model()

class PlacesTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        self.category = Category.objects.create(name='Restaurant', slug='restaurant', description='Food places')
        self.place = Place.objects.create(
            name='Test Restaurant',
            category=self.category,
            address='123 Test St',
            latitude=12.345678,
            longitude=87.654321,
            created_by=self.user
        )

    def test_category_creation(self):
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(self.category.name, 'Restaurant')

    def test_place_creation(self):
        self.assertEqual(Place.objects.count(), 1)
        self.assertEqual(self.place.name, 'Test Restaurant')

    def test_place_list_api(self):
        response = self.client.get('/api/places/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_review_creation_updates_rating(self):
        review = Review.objects.create(
            place=self.place,
            user=self.user,
            rating=4,
            comment='Good place!'
        )
        self.place.refresh_from_db()
        self.assertEqual(self.place.rating, 4.0)

        Review.objects.create(
            place=self.place,
            user=User.objects.create_user(username='user2', password='123'),
            rating=2,
            comment='Not so good.'
        )
        self.place.refresh_from_db()
        self.assertEqual(self.place.rating, 3.0)
