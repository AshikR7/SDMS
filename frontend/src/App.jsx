import { useState, useEffect, useCallback } from 'react'
import StudentForm from './components/StudentForm.jsx'
import StudentTable from './components/StudentTable.jsx'
import ChatBox from './components/ChatBox.jsx'
import { getStudents, createStudent, updateStudent, deleteStudent } from './api.js'

export default function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [formError, setFormError] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setListError('')
    try {
      const res = await getStudents()
      setStudents(res.data)
    } catch (err) {
      setListError('Failed to load students. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const handleSave = async (studentData) => {
    setFormError('')
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, studentData)
      } else {
        await createStudent(studentData)
      }
      setEditingStudent(null)
      await loadStudents()
    } catch (err) {
      const status = err.response?.status
      if (status === 409) {
        setFormError('A student with this email already exists.')
      } else if (status === 400) {
        const data = err.response?.data
        const firstError = data ? Object.values(data).flat()[0] : null
        setFormError(firstError || 'Please check the form for errors.')
      } else if (status === 404) {
        setFormError('That student no longer exists.')
        setEditingStudent(null)
        await loadStudents()
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    }
  }

  const handleEdit = (student) => {
    setFormError('')
    setEditingStudent(student)
  }

  const handleCancelEdit = () => {
    setFormError('')
    setEditingStudent(null)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this student?')
    if (!confirmed) return

    setListError('')
    try {
      await deleteStudent(id)
      if (editingStudent?.id === id) setEditingStudent(null)
      await loadStudents()
    } catch (err) {
      if (err.response?.status === 404) {
        setListError('That student was already deleted.')
        await loadStudents()
      } else {
        setListError('Failed to delete student. Please try again.')
      }
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Student Directory</h1>
      </header>

      <main className="page-content">
        <StudentForm
          editingStudent={editingStudent}
          onSave={handleSave}
          onCancelEdit={handleCancelEdit}
          serverError={formError}
        />

        <section className="table-section">
          <h2>Students</h2>
          {listError && <p className="form-error server-error">{listError}</p>}
          <StudentTable
            students={students}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>

        <ChatBox />
      </main>
    </div>
  )
}
