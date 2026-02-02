from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from app.database import get_db
from app.models import Employee, Attendance
from app.schemas import EmployeeCreate, EmployeeResponse, MessageResponse

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

# Create Employee
@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """
    Create a new employee with the following details:
    - **employee_id**: Unique employee identifier
    - **full_name**: Full name of the employee
    - **email**: Valid email address (unique)
    - **department**: Department name
    """
    try:
        # Check if employee_id already exists
        existing_emp = db.query(Employee).filter(
            Employee.employee_id == employee.employee_id
        ).first()
        
        if existing_emp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee ID '{employee.employee_id}' already exists"
            )
        
        # Check if email already exists
        existing_email = db.query(Employee).filter(
            Employee.email == employee.email
        ).first()
        
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{employee.email}' already exists"
            )
        
        # Create new employee
        db_employee = Employee(
            employee_id=employee.employee_id,
            full_name=employee.full_name,
            email=employee.email,
            department=employee.department
        )
        
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        
        return MessageResponse(
            message="Employee created successfully",
            detail={"employee_id": employee.employee_id}
        )
        
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error. Employee ID or email might already exist."
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

# Get All Employees
@router.get("/", response_model=List[EmployeeResponse])
def get_all_employees(db: Session = Depends(get_db)):
    """
    Retrieve a list of all employees
    """
    try:
        employees = db.query(Employee).all()
        return employees
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch employees: {str(e)}"
        )

# Get Employee by ID
@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """
    Get a specific employee by employee_id
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    return employee

# Delete Employee
@router.delete("/{employee_id}", response_model=MessageResponse)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """
    Delete an employee and all associated attendance records
    """
    try:
        # Check if employee exists
        employee = db.query(Employee).filter(
            Employee.employee_id == employee_id
        ).first()
        
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{employee_id}' not found"
            )
        
        # Delete all attendance records for this employee
        db.query(Attendance).filter(
            Attendance.employee_id == employee_id
        ).delete()
        
        # Delete employee
        db.delete(employee)
        db.commit()
        
        return MessageResponse(
            message=f"Employee '{employee_id}' and all associated records deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete employee: {str(e)}"
        )
