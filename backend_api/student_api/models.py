from django.db import models
from django.core.validators import MinValueValidator

class Student(models.Model):
    id = models.AutoField(primary_key=True)  # Django adds this automatically anyway
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    course = models.CharField(max_length=255)
    age = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # db_table = 'students'
        ordering = ['name']  # newest first, matches GET /api/students requirement

    def __str__(self):
        return self.name