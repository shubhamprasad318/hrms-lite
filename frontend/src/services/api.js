import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API calls
export const employeeAPI = {
  // Get all employees
  getAll: async () => {
    try {
      const response = await api.get('/employees/');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch employees';
    }
  },

  // Get single employee
  getById: async (employeeId) => {
    try {
      const response = await api.get(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch employee';
    }
  },

  // Create employee
  create: async (employeeData) => {
    try {
      const response = await api.post('/employees/', employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to create employee';
    }
  },

  // Delete employee
  delete: async (employeeId) => {
    try {
      const response = await api.delete(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to delete employee';
    }
  },
};

// Attendance API calls
export const attendanceAPI = {
  // Mark attendance
  mark: async (attendanceData) => {
    try {
      const response = await api.post('/attendance/', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to mark attendance';
    }
  },

  // Get employee attendance
  getByEmployee: async (employeeId) => {
    try {
      const response = await api.get(`/attendance/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch attendance';
    }
  },

  // Get all attendance records
  getAll: async () => {
    try {
      const response = await api.get('/attendance/');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to fetch attendance records';
    }
  },
};

export default api;
