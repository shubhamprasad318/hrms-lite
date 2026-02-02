import React, { useState } from 'react';
import { employeeAPI } from '../services/api';

function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

    try {
      const response = await employeeAPI.create(formData);
      setSuccess(response.message);
      
      // Reset form
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });

      // Notify parent component
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add New Employee</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="employee_id">
              Employee ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="e.g., EMP001"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="full_name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., john.doe@company.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">
              Department <span className="required">*</span>
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Engineering"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding Employee...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
