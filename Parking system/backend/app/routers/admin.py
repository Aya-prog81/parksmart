"""Admin endpoints: users list, agents list, analytics summary."""
from __future__ import annotations

from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import ParkingLot, Reservation, ReservationStatus, User, UserRole
from app.schemas import (
    AnalyticsSummary,
    OccupancyPoint,
    UserOut,
)


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> list[UserOut]:
    users = (
        db.query(User)
        .filter(User.role == UserRole.user)
        .order_by(User.created_at.desc())
        .all()
    )
    return [UserOut.model_validate(u) for u in users]


@router.get("/agents", response_model=list[UserOut])
def list_agents(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> list[UserOut]:
    agents = (
        db.query(User)
        .filter(User.role == UserRole.agent)
        .order_by(User.agent_code.asc())
        .all()
    )
    return [UserOut.model_validate(u) for u in agents]


@router.get("/analytics", response_model=AnalyticsSummary)
def analytics(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> AnalyticsSummary:
    total_users = db.query(func.count(User.id)).filter(User.role == UserRole.user).scalar() or 0
    lots = db.query(ParkingLot).all()
    total_lots = len(lots)
    total_capacity = sum(l.capacity for l in lots)
    total_occupied = sum(l.capacity - l.available for l in lots)

    total_reservations = db.query(func.count(Reservation.id)).scalar() or 0

    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = today_start + timedelta(days=1)
    today_query = db.query(Reservation).filter(
        Reservation.created_at >= today_start,
        Reservation.created_at < today_end,
    )
    today_reservations = today_query.count()
    today_revenue = (
        today_query.filter(Reservation.status != ReservationStatus.cancelled)
        .with_entities(func.coalesce(func.sum(Reservation.amount), 0.0))
        .scalar()
        or 0.0
    )

    points = []
    for lot in lots:
        occupied = lot.capacity - lot.available
        points.append(
            OccupancyPoint(
                lot_id=lot.id,
                name=lot.name,
                capacity=lot.capacity,
                available=lot.available,
                occupied=occupied,
                occupancy_rate=round(occupied / lot.capacity, 3) if lot.capacity else 0,
            )
        )

    return AnalyticsSummary(
        total_users=total_users,
        total_lots=total_lots,
        total_capacity=total_capacity,
        total_occupied=total_occupied,
        total_reservations=total_reservations,
        today_reservations=today_reservations,
        today_revenue=float(today_revenue),
        occupancy_by_lot=points,
    )
