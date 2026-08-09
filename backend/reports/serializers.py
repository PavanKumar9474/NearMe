from rest_framework import serializers
from .models import PlaceReport

class PlaceReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceReport
        fields = '__all__'
        read_only_fields = ('user', 'status', 'resolved_at')
