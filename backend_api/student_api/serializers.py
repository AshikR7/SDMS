from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'course', 'age', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name is required.")
        return value

    def validate_course(self, value):
        if not value.strip():
            raise serializers.ValidationError("Course is required.")
        return value

    def validate_age(self, value):
        if value <= 0:
            raise serializers.ValidationError("Age must be greater than 0.")
        return value