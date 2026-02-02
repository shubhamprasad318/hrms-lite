import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';

function AttendanceView({ selectedEmployeeId }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(selectedEmployeeId || '');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      setSelectedEmployee(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance(selectedEmployee);
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  const fetchAttendance = async (employeeId) => {
    try {
      setLoading(true);
      setError('');
      const data = await attendanceAPI.getByEmployee(employeeId);
      setAttendanceRecords(data);
    } catch (err) {
      setError(err);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const getEmployeeDetails = () => {
    return employees.find(emp => emp.employee_id === selectedEmployee);
  };

  const employeeDetails = getEmployeeDetails();

  return (
    <div className="card">
      <h2>View Attendance Records</h2>

      <div className="form-group">
        <label htmlFor="view-employee">Select Employee to View Records</label>
        <select
          id="view-employee"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          <option value="">-- Choose Employee --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.employee_id}>
              {emp.employee_id} - {emp.full_name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!selectedEmployee ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3>No Employee Selected</h3>
          <p>Please select an employee from the dropdown to view their attendance records.</p>
        </div>
      ) : loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading attendance records...</p>
        </div>
      ) : (
        <>
          {employeeDetails && (
            <div className="employee-info">
              <h3>{employeeDetails.full_name}</h3>
              <p className="text-muted">
                {employeeDetails.employee_id} • {employeeDetails.department}
              </p>
            </div>
          )}

          {attendanceRecords.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3>No Attendance Records</h3>
              <p>No attendance has been marked for this employee yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => {
                    const date = new Date(record.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    
                    return (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{dayName}</td>
                        <td>
                          <span className={`status-badge status-${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="attendance-summary">
                <p>
                  <strong>Total Records:</strong> {attendanceRecords.length} |{' '}
                  <strong className="text-success">
                    Present: {attendanceRecords.filter(r => r.status === 'Present').length}
                  </strong>{' '}
                  |{' '}
                  <strong className="text-danger">
                    Absent: {attendanceRecords.filter(r => r.status === 'Absent').length}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AttendanceView;
