from django.core.management.base import BaseCommand
from places.models import Category, Place
import random

class Command(BaseCommand):
    help = 'Seeds the database with demo places for development.'

    def handle(self, *args, **kwargs):
        categories_data = [
            {'name': 'Hospital', 'slug': 'hospital', 'icon': '🏥'},
            {'name': 'Pharmacy', 'slug': 'pharmacy', 'icon': '💊'},
            {'name': 'Police', 'slug': 'police', 'icon': '🚓'},
            {'name': 'ATM', 'slug': 'atm', 'icon': '🏧'},
            {'name': 'Fuel', 'slug': 'fuel', 'icon': '⛽'},
            {'name': 'Toilet', 'slug': 'toilet', 'icon': '🚻'},
            {'name': 'Restaurant', 'slug': 'restaurant', 'icon': '🍽️'},
            {'name': 'Hotel', 'slug': 'hotel', 'icon': '🏨'},
            {'name': 'Mechanic', 'slug': 'mechanic', 'icon': '🔧'},
            {'name': 'Parking', 'slug': 'parking', 'icon': '🅿️'},
            {'name': 'Grocery', 'slug': 'grocery', 'icon': '🛒'},
            {'name': 'Emergency', 'slug': 'emergency', 'icon': '🚑'},
        ]

        self.stdout.write("Creating categories...")
        category_objects = {}
        for cat in categories_data:
            obj, created = Category.objects.get_or_create(
                slug=cat['slug'],
                defaults={'name': cat['name'], 'icon': cat['icon']}
            )
            category_objects[cat['slug']] = obj

        self.stdout.write("Creating demo places...")
        
        # We will generate demo places around a central point.
        # Let's say user is roughly at 13.0, 78.0 (somewhere in India, similar to the prompt example)
        center_lat = 13.123
        center_lng = 78.123

        places_created = 0

        for cat_slug, cat_obj in category_objects.items():
            for i in range(1, 6): # 5 places per category
                lat_offset = random.uniform(-0.05, 0.05)
                lng_offset = random.uniform(-0.05, 0.05)
                
                Place.objects.create(
                    name=f"Demo {cat_obj.name} {i}",
                    category=cat_obj,
                    description=f"A demo {cat_obj.name.lower()} for development purposes.",
                    address=f"{i} Main Road, Demo City",
                    latitude=center_lat + lat_offset,
                    longitude=center_lng + lng_offset,
                    phone="999-999-9999",
                    website=f"https://example.com/{cat_slug}{i}",
                    opening_hours="24 Hours" if cat_slug in ['hospital', 'atm', 'emergency'] else "9 AM - 9 PM",
                    rating=round(random.uniform(3.0, 5.0), 1),
                    is_verified=random.choice([True, False])
                )
                places_created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(categories_data)} categories and {places_created} demo places."))
