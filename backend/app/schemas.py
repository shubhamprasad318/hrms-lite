from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

# Employee Schemas

class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    
    class Config:
        from_attributes = True

# Attendance Schemas

class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    
    class Config:
        from_attributes = True

# Response Messages

class MessageResponse(BaseModel):
    message: str
    detail: Optional[dict] = None
