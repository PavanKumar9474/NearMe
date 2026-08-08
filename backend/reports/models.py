from django.db import models
from django.conf import settings

class PlaceReport(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected')
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    place = models.ForeignKey('places.Place', on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Report for {self.place.name} - {self.report_type}"
