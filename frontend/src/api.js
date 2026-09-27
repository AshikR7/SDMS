import axios from 'axios'

// Base URL for the Django REST Framework backend.
// Adjust if your backend runs on a different host/port.
const API_BASE_URL = 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// NOTE: DRF's DefaultRouter generates URLs with a trailing slash by default
// (e.g. /api/students/). If your backend uses DefaultRouter(trailing_slash=False),
// remove the trailing slashes below to match.

export const getStudents = () => client.get('/students/')

export const createStudent = (student) => client.post('/students/', student)

export const updateStudent = (id, student) =>
  client.put(`/students/${id}/`, student)

export const deleteStudent = (id) => client.delete(`/students/${id}/`)

// Your StudentAIAssistantView is a plain APIView (not router-registered),
// so it was mapped directly with path('assistant/', ...) — no trailing-slash
// ambiguity here since you controlled that path() call yourself.
export const sendChatMessage = (message) =>
  client.post('/assistant/', { message })

export default client
