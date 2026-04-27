"""Parking-lot endpoints (public list + admin CRUD)."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import ParkingLot, User
from app.schemas import (
    Message,
    ParkingLotCreate,
    ParkingLotOut,
    ParkingLotUpdate,
)


router = APIRouter(prefix="/lots", tags=["lots"])


@router.get("", response_model=list[ParkingLotOut])
def list_lots(db: Session = Depends(get_db)) -> list[ParkingLotOut]:
    lots = db.query(ParkingLot).order_by(ParkingLot.id.asc()).all()
    return [ParkingLotOut.model_validate(lot) for lot in lots]


@router.get("/{lot_id}", response_model=ParkingLotOut)
def get_lot(lot_id: int, db: Session = Depends(get_db)) -> ParkingLotOut:
    lot = db.query(ParkingLot).filter(ParkingLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Parking lot not found")
    return ParkingLotOut.model_validate(lot)


@router.post("", response_model=ParkingLotOut, status_code=status.HTTP_201_CREATED)
def create_lot(
    payload: ParkingLotCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ParkingLotOut:
    if payload.available > payload.capacity:
        raise HTTPException(
            status_code=400, detail="available cannot exceed capacity"
        )
    lot = ParkingLot(**payload.model_dump())
    db.add(lot)
    db.commit()
    db.refresh(lot)
    return ParkingLotOut.model_validate(lot)


@router.patch("/{lot_id}", response_model=ParkingLotOut)
def update_lot(
    lot_id: int,
    payload: ParkingLotUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> ParkingLotOut:
    lot = db.query(ParkingLot).filter(ParkingLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Parking lot not found")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(lot, key, value)
    if lot.available > lot.capacity:
        raise HTTPException(
            status_code=400, detail="available cannot exceed capacity"
        )
    db.commit()
    db.refresh(lot)
    return ParkingLotOut.model_validate(lot)


@router.delete("/{lot_id}", response_model=Message)
def delete_lot(
    lot_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Message:
    lot = db.query(ParkingLot).filter(ParkingLot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Parking lot not found")
    db.delete(lot)
    db.commit()
    return Message(message=f"Parking lot {lot_id} deleted")
