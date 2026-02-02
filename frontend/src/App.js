import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import AttendanceForm from './components/AttendanceForm';
import AttendanceView from './components/AttendanceView';
import './App.css';

function EmployeesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEmployeeAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <h1 className="page-title">Employee Management</h1>
      <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
      <EmployeeList refreshTrigger={refreshTrigger} />
    </div>
  );
}

function AttendancePage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const handleAttendanceMarked = (employeeId) => {
    setSelectedEmployeeId(employeeId);
  };

  return (
    <div>
      <h1 className="page-title">Attendance Management</h1>
      <AttendanceForm onAttendanceMarked={handleAttendanceMarked} />
      <AttendanceView selectedEmployeeId={selectedEmployeeId} />
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <div className="hero">
        <h1>Welcome to HRMS Lite</h1>
        <p className="hero-subtitle">
          A lightweight Human Resource Management System for managing employees and tracking attendance
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Employee Management</h3>
            <p>Add, view, and manage employee records with ease</p>
            <Link to="/employees" className="btn btn-primary">
              Manage Employees
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Attendance Tracking</h3>
            <p>Mark and view daily attendance records</p>
            <Link to="/attendance" className="btn btn-primary">
              Track Attendance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              <span className="logo-icon">🏢</span>
              HRMS Lite
            </Link>
            
            <div className="nav-links">
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/employees" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Employees
              </NavLink>
              <NavLink 
                to="/attendance" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Attendance
              </NavLink>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </div>

        <footer className="footer">
          <div className="footer-container">
            <p>&copy; 2026 HRMS Lite. Built with React & FastAPI.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
