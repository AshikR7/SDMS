import { useState, useEffect } from 'react'

const EMPTY_STUDENT = { name: '', email: '', course: '', age: '' }

export default function StudentForm({ editingStudent, onSave, onCancelEdit, serverError }) {
  const [form, setForm] = useState(EMPTY_STUDENT)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name,
        email: editingStudent.email,
        course: editingStudent.course,
        age: editingStudent.age,
      })
    } else {
      setForm(EMPTY_STUDENT)
    }
    setErrors({})
  }, [editingStudent])

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    if (!form.course.trim()) next.course = 'Course is required.'
    if (form.age === '' || Number(form.age) <= 0) {
      next.age = 'Age must be greater than 0.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...form, age: Number(form.age) })
  }

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>

      {serverError && <p className="form-error server-error">{serverError}</p>}

      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div className="field">
        <label htmlFor="course">Course</label>
        <input
          id="course"
          name="course"
          type="text"
          value={form.course}
          onChange={handleChange}
        />
        {errors.course && <p className="form-error">{errors.course}</p>}
      </div>

      <div className="field">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          min="1"
          value={form.age}
          onChange={handleChange}
        />
        {errors.age && <p className="form-error">{errors.age}</p>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingStudent ? 'Update' : 'Save'}
        </button>
        {editingStudent && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
