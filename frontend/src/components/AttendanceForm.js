import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';

function AttendanceForm({ onAttendanceMarked }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.employee_id) {
      setError('Please select an employee');
      setLoading(false);
      return;
    }

    try {
      const response = await attendanceAPI.mark(formData);
      setSuccess(response.message);

      // Notify parent
      if (onAttendanceMarked) {
        onAttendanceMarked(formData.employee_id);
      }

      // Clear success after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Mark Attendance</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employee_id">
            Select Employee <span className="required">*</span>
          </label>
          <select
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
            disabled={loading || employees.length === 0}
          >
            <option value="">-- Choose Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name} ({emp.department})
              </option>
            ))}
          </select>
          {employees.length === 0 && (
            <p className="form-help">No employees available. Please add employees first.</p>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="date">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              Status <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="Present"
                  checked={formData.status === 'Present'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="radio-text">Present</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="Absent"
                  checked={formData.status === 'Absent'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="radio-text">Absent</span>
              </label>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || employees.length === 0}
        >
          {loading ? 'Marking Attendance...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  );
}

export default AttendanceForm;
