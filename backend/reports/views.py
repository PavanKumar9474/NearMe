from rest_framework import viewsets
from .models import PlaceReport
from .serializers import PlaceReportSerializer

class PlaceReportViewSet(viewsets.ModelViewSet):
    queryset = PlaceReport.objects.all()
    serializer_class = PlaceReportSerializer

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
