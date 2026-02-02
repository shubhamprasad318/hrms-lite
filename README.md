# HRMS Lite - Human Resource Management System

A lightweight, full-stack web application for managing employees and tracking daily attendance. Designed to simulate essential HR operations with a focus on usability, stability, and clean code.

---

## 🌐 Live Demo & Resources

| Resource | Link |
|----------|------|
| **🚀 Live Application** | [**https://hrms-lite-nine-phi.vercel.app**](https://hrms-lite-nine-phi.vercel.app) |
| **📄 API Docs (Swagger)**| [**https://hrms-lite-kdz4.onrender.com/docs**](https://hrms-lite-kdz4.onrender.com/docs) |
| **💻 GitHub Repository** | [**https://github.com/shubhamprasad318/hrms-lite**](https://github.com/shubhamprasad318/hrms-lite) |

---

## 📋 Project Overview

HRMS Lite is a production-ready web application designed to streamline employee management for small organizations. The application allows an administrator to maintain a directory of employees and track their daily attendance status efficiently.

### **Key Capabilities**
- **Employee Management**: Add, view, and delete employee records with strict validation.
- **Attendance Tracking**: Mark employees as "Present" or "Absent" for specific dates.
- **Data Integrity**: Prevents duplicate emails, duplicate IDs, and duplicate daily attendance entries.
- **Modern UI**: A responsive, clean interface built with React that works on desktop and mobile.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js**: Component-based UI library
- **React Router**: For handling client-side navigation
- **Axios**: For making HTTP requests to the backend
- **CSS3**: Custom styling using Flexbox and Grid

### **Backend**
- **Python 3.13**: Core programming language
- **FastAPI**: Modern, high-performance web framework for APIs
- **SQLAlchemy**: ORM for database interactions
- **Pydantic**: For robust data validation and settings management
- **Uvicorn**: ASGI server for production deployment

### **Database & Deployment**
- **SQLite**: Serverless database (Chosen for simplicity and portability)
- **Render**: Hosting for the Backend API
- **Vercel**: Hosting for the Frontend Client

---

## 🔌 API Endpoints

The backend exposes a RESTful API documented via Swagger UI.

### **Employee Operations**
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/employees/` | Create a new employee record |
| `GET` | `/employees/` | Retrieve a list of all employees |
| `GET` | `/employees/{employee_id}` | Get details of a specific employee |
| `DELETE` | `/employees/{employee_id}` | Delete an employee (cascades to attendance) |

### **Attendance Operations**
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/attendance/` | Mark attendance (Create or Update existing) |
| `GET` | `/attendance/{employee_id}` | Get attendance history for a specific employee |
| `GET` | `/attendance/` | Get all attendance records with employee details |

### **System & Utility**
| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/` | API root information and status |
| `GET` | `/health` | Health check probe for monitoring |
| `GET` | `/docs` | Interactive API documentation (Swagger UI) |

---

## 💻 Local Setup Instructions

Follow these steps to run the application on your local machine.

### **Prerequisites**
- Python 3.8+ installed
- Node.js 14+ and npm installed
- Git installed

### **1. Clone the Repository**
```bash
git clone https://github.com/shubhamprasad318/hrms-lite.git
cd hrms-lite
```

### **2. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
The backend will run on `http://127.0.0.1:8000`.

### **3. Frontend Setup**
Open a new terminal (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Create .env file
# Windows (PowerShell):
echo "REACT_APP_API_URL=http://127.0.0.1:8000" > .env
# Mac/Linux:
echo "REACT_APP_API_URL=http://127.0.0.1:8000" > .env

# Install dependencies
npm install

# Start the application
npm start
```
The frontend will open at `http://localhost:3000`.

---

## 🔒 Validation Rules

- **Employee ID**: Must be unique system-wide.
- **Email**: Must be a valid email format and unique.
- **Attendance**:
  - Only one record per employee per date is allowed.
  - Submitting attendance for a date that already exists will update the status (e.g., changing 'Absent' to 'Present').

---

## ⚠️ Assumptions & Limitations

- **Authentication**: As per the assignment scope, the system is designed for a single admin user. No login or role-based access control is implemented.
- **Database Persistence**: The live backend is hosted on Render's Free Tier. This tier uses an ephemeral filesystem, meaning the SQLite database file may be reset if the server restarts or spins down due to inactivity. For a real production environment, this would be connected to a persistent PostgreSQL instance.
- **Timezone**: Attendance dates are stored based on the client's local date selection.

---

## 👨‍💻 Developer Information

**Developed by**: Shubham Prasad  
**Email**: shubhamprasad3758@gmail.com  
**GitHub**: [@shubhamprasad318](https://github.com/shubhamprasad318)  
**Location**: Jamshedpur, Jharkhand, India

---

## 📄 License

This project is open source and available for educational and portfolio purposes.

---

## 🙏 Acknowledgments

Built as a demonstration of full-stack development capabilities using modern web technologies.
