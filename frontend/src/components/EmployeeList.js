import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';

function EmployeeList({ refreshTrigger }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId, fullName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete employee "${fullName}"?\n\nThis will also delete all their attendance records.`
    );

    if (!confirmed) return;

    try {
      const response = await employeeAPI.delete(employeeId);
      setDeleteSuccess(response.message);
      fetchEmployees(); // Refresh list

      // Clear success message after 3 seconds
      setTimeout(() => setDeleteSuccess(''), 3000);
    } catch (err) {
      setError(err);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Employee List ({employees.length})</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {deleteSuccess && <div className="alert alert-success">{deleteSuccess}</div>}

      {employees.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3>No Employees Found</h3>
          <p>Get started by adding your first employee using the form above.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <span className="badge">{employee.employee_id}</span>
                  </td>
                  <td className="font-medium">{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(employee.employee_id, employee.full_name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
