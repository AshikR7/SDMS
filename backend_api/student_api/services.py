from google import genai
from django.conf import settings
from .models import Student

def get_student_assistant_response(user_message, student_context=None):

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    system_prompt = """You are an AI assistant for a Student Directory Management System.
You help answer questions about students, courses, and enrollment data.
Be concise and helpful. If asked to modify data, explain that changes must be made
through the app's Edit/Delete functionality, since you cannot write to the database directly."""

    if student_context:
        system_prompt += f"""
Current Student Directory Summary:
- Total students: {student_context['count']}
- Courses offered: {', '.join(student_context['courses'])}
"""

    full_message = system_prompt + "\nUser: " + user_message

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=full_message
    )

    return response.text


def get_student_context():
    students = Student.objects.all()
    return {
        "count": students.count(),
        "courses": list(students.values_list('course', flat=True).distinct())
    }