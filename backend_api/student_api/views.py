from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Student Directory.
    GET    /api/students/       -> list all students
    POST   /api/students/       -> create a student
    GET    /api/students/{id}/  -> retrieve one student
    PUT    /api/students/{id}/  -> update a student
    DELETE /api/students/{id}/  -> delete a student
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def create(self, request, *args, **kwargs):
        if Student.objects.filter(email=request.data.get('email')).exists():
            return Response(
                {"detail": "A student with this email already exists."},
                status=status.HTTP_409_CONFLICT
            )
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "A student with this email already exists."},
                status=status.HTTP_409_CONFLICT
            )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        email = request.data.get('email')
        if email and Student.objects.filter(email=email).exclude(pk=instance.pk).exists():
            return Response(
                {"detail": "A student with this email already exists."},
                status=status.HTTP_409_CONFLICT
            )
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "A student with this email already exists."},
                status=status.HTTP_409_CONFLICT
            )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)