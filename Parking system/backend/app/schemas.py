"""Pydantic schemas for request/response validation."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import ReservationStatus, UserRole



class UserRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AgentLogin(BaseModel):
    agent_code: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole
    agent_code: Optional[str] = None
    assigned_lot_id: Optional[int] = None
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Parking lots ----------

class ParkingLotBase(BaseModel):
    name: str
    zone: str
    capacity: int = Field(gt=0)
    available: int = Field(ge=0)
    price_per_hour: float = Field(gt=0)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ParkingLotCreate(ParkingLotBase):
    pass


class ParkingLotUpdate(BaseModel):
    name: Optional[str] = None
    zone: Optional[str] = None
    capacity: Optional[int] = Field(default=None, gt=0)
    available: Optional[int] = Field(default=None, ge=0)
    price_per_hour: Optional[float] = Field(default=None, gt=0)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ParkingLotOut(ParkingLotBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


# ---------- Reservations ----------

class ReservationCreate(BaseModel):
    lot_id: int
    start_time: Optional[datetime] = None
    duration_hours: int = Field(default=1, ge=1, le=24)
    payment_method: str = Field(default="card", max_length=30)


class ReservationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: str
    user_id: int
    lot_id: int
    start_time: datetime
    duration_hours: int
    amount: float
    status: ReservationStatus
    payment_method: str
    created_at: datetime


class ReservationDetailed(ReservationOut):
    lot: ParkingLotOut
    user: UserOut


# ---------- Agent ----------

class AgentActionOut(BaseModel):
    lot: ParkingLotOut
    action: str
    occupied: int


# ---------- Admin / Analytics ----------

class OccupancyPoint(BaseModel):
    lot_id: int
    name: str
    capacity: int
    available: int
    occupied: int
    occupancy_rate: float


class AnalyticsSummary(BaseModel):
    total_users: int
    total_lots: int
    total_capacity: int
    total_occupied: int
    total_reservations: int
    today_reservations: int
    today_revenue: float
    occupancy_by_lot: list[OccupancyPoint]




class Message(BaseModel):
    message: str
