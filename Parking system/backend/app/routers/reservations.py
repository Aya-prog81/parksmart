"""Reservation endpoints: book a spot, list own, cancel."""
from __future__ import annotations

import secrets
import string
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import ParkingLot, Reservation, ReservationStatus, User
from app.schemas import (
    Message,
    ReservationCreate,
    ReservationDetailed,
    ReservationOut,
)


router = APIRouter(prefix="/reservations", tags=["reservations"])


def _generate_booking_id() -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "IFR-" + "".join(secrets.choice(alphabet) for _ in range(6))


@router.post("", response_model=ReservationDetailed, status_code=status.HTTP_201_CREATED)
def create_reservation(
    payload: ReservationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ReservationDetailed:
    lot = db.query(ParkingLot).filter(ParkingLot.id == payload.lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Parking lot not found")
    if lot.available <= 0:
        raise HTTPException(status_code=409, detail="No available spots in this lot")

    amount = round(lot.price_per_hour * payload.duration_hours, 2)
    booking_id = _generate_booking_id()
    # Ensure uniqueness
    while db.query(Reservation).filter(Reservation.booking_id == booking_id).first():
        booking_id = _generate_booking_id()

    reservation = Reservation(
        booking_id=booking_id,
        user_id=user.id,
        lot_id=lot.id,
        start_time=payload.start_time or datetime.now(timezone.utc).replace(tzinfo=None),
        duration_hours=payload.duration_hours,
        amount=amount,
        status=ReservationStatus.active,
        payment_method=payload.payment_method,
    )
    lot.available -= 1
    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    # Eager-load relations for response
    reservation = (
        db.query(Reservation)
        .options(joinedload(Reservation.lot), joinedload(Reservation.user))
        .filter(Reservation.id == reservation.id)
        .first()
    )
    return ReservationDetailed.model_validate(reservation)


@router.get("/me", response_model=list[ReservationDetailed])
def my_reservations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[ReservationDetailed]:
    items = (
        db.query(Reservation)
        .options(joinedload(Reservation.lot), joinedload(Reservation.user))
        .filter(Reservation.user_id == user.id)
        .order_by(Reservation.created_at.desc())
        .all()
    )
    return [ReservationDetailed.model_validate(r) for r in items]


@router.get("", response_model=list[ReservationDetailed])
def list_all_reservations(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> list[ReservationDetailed]:
    items = (
        db.query(Reservation)
        .options(joinedload(Reservation.lot), joinedload(Reservation.user))
        .order_by(Reservation.created_at.desc())
        .all()
    )
    return [ReservationDetailed.model_validate(r) for r in items]


@router.post("/{reservation_id}/cancel", response_model=ReservationOut)
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ReservationOut:
    reservation = (
        db.query(Reservation).filter(Reservation.id == reservation_id).first()
    )
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if reservation.user_id != user.id and user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not your reservation")
    if reservation.status != ReservationStatus.active:
        raise HTTPException(status_code=400, detail="Reservation is not active")
    reservation.status = ReservationStatus.cancelled
    lot = db.query(ParkingLot).filter(ParkingLot.id == reservation.lot_id).first()
    if lot and lot.available < lot.capacity:
        lot.available += 1
    db.commit()
    db.refresh(reservation)
    return ReservationOut.model_validate(reservation)
