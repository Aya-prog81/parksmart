"""Agent endpoints: adjust live availability for the agent's assigned lot."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_agent
from app.models import ParkingLot, User
from app.schemas import AgentActionOut, ParkingLotOut


router = APIRouter(prefix="/agent", tags=["agent"])


def _resolve_lot(db: Session, user: User) -> ParkingLot:
    if not user.assigned_lot_id:
        raise HTTPException(
            status_code=400, detail="Agent has no assigned parking lot"
        )
    lot = (
        db.query(ParkingLot)
        .filter(ParkingLot.id == user.assigned_lot_id)
        .first()
    )
    if not lot:
        raise HTTPException(status_code=404, detail="Assigned lot not found")
    return lot


@router.get("/my-lot", response_model=ParkingLotOut)
def get_my_lot(
    db: Session = Depends(get_db),
    user: User = Depends(require_agent),
) -> ParkingLotOut:
    return ParkingLotOut.model_validate(_resolve_lot(db, user))


@router.post("/enter", response_model=AgentActionOut)
def register_entry(
    db: Session = Depends(get_db),
    user: User = Depends(require_agent),
) -> AgentActionOut:
    """Car entered the lot — available decreases by 1."""
    lot = _resolve_lot(db, user)
    if lot.available <= 0:
        raise HTTPException(status_code=409, detail="Parking lot is full")
    lot.available -= 1
    db.commit()
    db.refresh(lot)
    return AgentActionOut(
        lot=ParkingLotOut.model_validate(lot),
        action="enter",
        occupied=lot.capacity - lot.available,
    )


@router.post("/exit", response_model=AgentActionOut)
def register_exit(
    db: Session = Depends(get_db),
    user: User = Depends(require_agent),
) -> AgentActionOut:
    """Car left the lot — available increases by 1."""
    lot = _resolve_lot(db, user)
    if lot.available >= lot.capacity:
        raise HTTPException(status_code=409, detail="Parking lot is already empty")
    lot.available += 1
    db.commit()
    db.refresh(lot)
    return AgentActionOut(
        lot=ParkingLotOut.model_validate(lot),
        action="exit",
        occupied=lot.capacity - lot.available,
    )
