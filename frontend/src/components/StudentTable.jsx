export default function StudentTable({ students, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="status-message">Loading...</p>
  }

  if (!students.length) {
    return <p className="status-message">No students yet.</p>
  }

  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Course</th>
          <th>Age</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.course}</td>
            <td>{student.age}</td>
            <td className="actions">
              <button className="btn btn-small" onClick={() => onEdit(student)}>
                Edit
              </button>
              <button
                className="btn btn-small btn-danger"
                onClick={() => onDelete(student.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
