from rest_framework import viewsets
from .models import PlaceReport
from .serializers import PlaceReportSerializer

class PlaceReportViewSet(viewsets.ModelViewSet):
    queryset = PlaceReport.objects.all()
    serializer_class = PlaceReportSerializer
