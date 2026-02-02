from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from datetime import date

from app.database import get_db
from app.models import Employee, Attendance, AttendanceStatus
from app.schemas import AttendanceCreate, AttendanceResponse, MessageResponse

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

# Mark Attendance
@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """
    Mark attendance for an employee:
    - **employee_id**: Employee identifier
    - **date**: Attendance date (YYYY-MM-DD)
    - **status**: Either "Present" or "Absent"
    
    If attendance already exists for the same employee and date, it will be updated.
    """
    try:
        # Validate status
        if attendance.status not in ["Present", "Absent"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be either 'Present' or 'Absent'"
            )
        
        # Check if employee exists
        employee = db.query(Employee).filter(
            Employee.employee_id == attendance.employee_id
        ).first()
        
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID '{attendance.employee_id}' not found"
            )
        
        # Check if attendance already exists for this date
        existing_attendance = db.query(Attendance).filter(
            and_(
                Attendance.employee_id == attendance.employee_id,
                Attendance.date == attendance.date
            )
        ).first()
        
        if existing_attendance:
            # Update existing attendance
            existing_attendance.status = AttendanceStatus(attendance.status)
            db.commit()
            
            return MessageResponse(
                message=f"Attendance updated successfully for {attendance.date}",
                detail={
                    "employee_id": attendance.employee_id,
                    "date": str(attendance.date),
                    "status": attendance.status,
                    "action": "updated"
                }
            )
        else:
            # Create new attendance record
            db_attendance = Attendance(
                employee_id=attendance.employee_id,
                date=attendance.date,
                status=AttendanceStatus(attendance.status)
            )
            
            db.add(db_attendance)
            db.commit()
            db.refresh(db_attendance)
            
            return MessageResponse(
                message=f"Attendance marked successfully for {attendance.date}",
                detail={
                    "employee_id": attendance.employee_id,
                    "date": str(attendance.date),
                    "status": attendance.status,
                    "action": "created"
                }
            )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark attendance: {str(e)}"
        )

# Get Attendance for Specific Employee
@router.get("/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(employee_id: str, db: Session = Depends(get_db)):
    """
    Retrieve all attendance records for a specific employee, ordered by date (newest first)
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
        
        # Get attendance records
        attendance_records = db.query(Attendance).filter(
            Attendance.employee_id == employee_id
        ).order_by(Attendance.date.desc()).all()
        
        return attendance_records
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch attendance: {str(e)}"
        )

# Get All Attendance Records (Optional - for admin view)
@router.get("/", response_model=List[dict])
def get_all_attendance(db: Session = Depends(get_db)):
    """
    Retrieve all attendance records with employee details
    """
    try:
        # Join attendance with employee to get full details
        records = db.query(
            Attendance.id,
            Attendance.employee_id,
            Employee.full_name,
            Attendance.date,
            Attendance.status
        ).join(
            Employee, Attendance.employee_id == Employee.employee_id
        ).order_by(Attendance.date.desc()).all()
        
        # Convert to list of dicts
        result = [
            {
                "id": record.id,
                "employee_id": record.employee_id,
                "full_name": record.full_name,
                "date": str(record.date),
                "status": record.status.value  # Get enum value
            }
            for record in records
        ]
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch attendance records: {str(e)}"
        )
