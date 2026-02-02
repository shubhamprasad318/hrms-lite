from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routes import employees, attendance

# Initialize FastAPI app
app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight Human Resource Management System API for managing employees and attendance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration (allow all origins for simplicity - restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()
    print("✅ Database initialized successfully")

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)

# Root endpoint
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to HRMS Lite API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "employees": "/employees",
            "attendance": "/attendance"
        }
    }

# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "HRMS Lite API"
    }
