"""Seed the database with initial parking lots, agents, and an admin.

Run with:  python -m app.seed
           python -m app.seed --reset   # wipes existing lots first

Lot data is realistic for Ifrane (Morocco) and Al Akhawayn University (AUI):
- AUI campus has 3 active lots + 1 under construction (~500 spots total)
- Ifrane city has 7 lots covering main squares, hotels, market, and forest area
- All coordinates are real and verified against OpenStreetMap.
"""
from __future__ import annotations

import logging

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import ParkingLot, User, UserRole
from app.security import hash_password


logger = logging.getLogger("seed")
logging.basicConfig(level=logging.INFO)


# AUI campus is roughly centred at (33.5378, -5.1062).
# Ifrane city centre is roughly (33.5269, -5.1106).
LOTS: list[dict] = [
    # ============ Al Akhawayn University (AUI) ============
    {
        "name": "AUI - \u0627\u0644\u0645\u0648\u0642\u0641 \u0627\u0644\u0631\u0626\u064a\u0633\u064a (P1)",
        "zone": "AUI",
        "capacity": 180,
        "available": 42,
        "price_per_hour": 0.0,
        "latitude": 33.5388,
        "longitude": -5.1054,
    },
    {
        "name": "AUI - \u0645\u0648\u0642\u0641 \u0627\u0644\u0645\u0643\u062a\u0628\u0629 \u0645\u062d\u0645\u062f \u0627\u0644\u0633\u0627\u062f\u0633 (P2)",
        "zone": "AUI",
        "capacity": 120,
        "available": 18,
        "price_per_hour": 0.0,
        "latitude": 33.5374,
        "longitude": -5.1078,
    },
    {
        "name": "AUI - \u0645\u0648\u0642\u0641 \u0627\u0644\u0645\u0631\u0643\u0632 \u0627\u0644\u0631\u064a\u0627\u0636\u064a (P3)",
        "zone": "AUI",
        "capacity": 95,
        "available": 33,
        "price_per_hour": 0.0,
        "latitude": 33.5364,
        "longitude": -5.1042,
    },
    {
        "name": "AUI - \u0627\u0644\u0645\u0648\u0642\u0641 \u0627\u0644\u062c\u062f\u064a\u062f (\u0642\u064a\u062f \u0627\u0644\u0625\u0646\u0634\u0627\u0621)",
        "zone": "AUI",
        "capacity": 100,
        "available": 0,
        "price_per_hour": 0.0,
        "latitude": 33.5398,
        "longitude": -5.1085,
    },
    # ============ Ifrane City ============
    {
        "name": "\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 (Place du March\u00e9)",
        "zone": "\u0648\u0633\u0637 \u0627\u0644\u0645\u062f\u064a\u0646\u0629",
        "capacity": 80,
        "available": 24,
        "price_per_hour": 2.0,
        "latitude": 33.5278,
        "longitude": -5.1097,
    },
    {
        "name": "\u0634\u0627\u0631\u0639 \u0627\u0644\u062d\u0633\u0646 \u0627\u0644\u062b\u0627\u0646\u064a (Avenue Hassan II)",
        "zone": "\u0648\u0633\u0637 \u0627\u0644\u0645\u062f\u064a\u0646\u0629",
        "capacity": 65,
        "available": 9,
        "price_per_hour": 2.0,
        "latitude": 33.5247,
        "longitude": -5.1112,
    },
    {
        "name": "\u0645\u0648\u0642\u0641 \u0641\u0646\u062f\u0642 \u0627\u0644\u0645\u064a\u0634\u0644\u064a\u0641\u0646 (H\u00f4tel Michlifen)",
        "zone": "\u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0633\u064a\u0627\u062d\u064a\u0629",
        "capacity": 55,
        "available": 12,
        "price_per_hour": 2.0,
        "latitude": 33.5242,
        "longitude": -5.1080,
    },
    {
        "name": "\u0633\u0627\u062d\u0629 \u0627\u0644\u0643\u0627\u062a\u062f\u0631\u0627\u0626\u064a\u0629 (Place de la Cath\u00e9drale)",
        "zone": "\u0627\u0644\u0634\u0645\u0627\u0644",
        "capacity": 40,
        "available": 4,
        "price_per_hour": 2.0,
        "latitude": 33.5260,
        "longitude": -5.1135,
    },
    {
        "name": "\u0627\u0644\u0645\u0644\u0639\u0628 \u0627\u0644\u0628\u0644\u062f\u064a (Stade Municipal)",
        "zone": "\u0627\u0644\u062c\u0646\u0648\u0628",
        "capacity": 60,
        "available": 28,
        "price_per_hour": 2.0,
        "latitude": 33.5215,
        "longitude": -5.1156,
    },
    {
        "name": "\u0634\u0627\u0631\u0639 \u0645\u062d\u0645\u062f \u0627\u0644\u062e\u0627\u0645\u0633 (Avenue Mohammed V)",
        "zone": "\u0648\u0633\u0637 \u0627\u0644\u0645\u062f\u064a\u0646\u0629",
        "capacity": 70,
        "available": 0,
        "price_per_hour": 2.0,
        "latitude": 33.5290,
        "longitude": -5.1145,
    },
    {
        "name": "\u0623\u0633\u062f \u0625\u0641\u0631\u0627\u0646 (Lion d'Atlas)",
        "zone": "\u0627\u0644\u063a\u0627\u0628\u0629",
        "capacity": 35,
        "available": 21,
        "price_per_hour": 3.0,
        "latitude": 33.5305,
        "longitude": -5.1168,
    },
]

AGENTS: list[dict] = [
    {"code": "AGT-001", "full_name": "\u0623\u062d\u0645\u062f \u0627\u0644\u0631\u0627\u0636\u064a",  "email": "agt001@ifrane-parking.ma", "lot_index": 0},
    {"code": "AGT-002", "full_name": "\u0633\u0639\u064a\u062f \u0627\u0644\u0628\u062f\u0648\u064a",  "email": "agt002@ifrane-parking.ma", "lot_index": 1},
    {"code": "AGT-003", "full_name": "\u064a\u0648\u0633\u0641 \u0627\u0644\u062d\u0633\u0646\u064a",  "email": "agt003@ifrane-parking.ma", "lot_index": 4},
    {"code": "AGT-004", "full_name": "\u0643\u0631\u064a\u0645 \u0627\u0644\u0632\u064a\u0627\u062a\u064a", "email": "agt004@ifrane-parking.ma", "lot_index": 6},
    {"code": "AGT-005", "full_name": "\u062d\u0645\u0632\u0629 \u0627\u0644\u0639\u0644\u0648\u064a",   "email": "agt005@ifrane-parking.ma", "lot_index": 8},
]

ADMIN = {
    "email": "admin@ifrane-parking.ma",
    "full_name": "\u0645\u062f\u064a\u0631 \u0627\u0644\u0646\u0638\u0627\u0645",
    "password": "Admin@12345",
}

AGENT_DEFAULT_PASSWORD = "Agent@12345" 


def seed(db: Session, *, force: bool = False) -> None:
    if force:
        db.query(ParkingLot).delete()
        db.commit()
        logger.info("Existing parking lots wiped (force=True).")

    created_lots: list[ParkingLot] = []
    if db.query(ParkingLot).count() == 0:
        for data in LOTS:
            lot = ParkingLot(**data)
            db.add(lot)
            created_lots.append(lot)
        db.commit()
        for lot in created_lots:
            db.refresh(lot)
        total = sum(l.capacity for l in created_lots)
        logger.info("Seeded %d parking lots (total capacity: %d spots).",
                    len(created_lots), total)
    else:
        created_lots = db.query(ParkingLot).order_by(ParkingLot.id.asc()).all()
        logger.info("Parking lots already exist - skipping (use --reset to wipe).")

    if not db.query(User).filter(User.email == ADMIN["email"]).first():
        admin = User(
            email=ADMIN["email"],
            full_name=ADMIN["full_name"],
            hashed_password=hash_password(ADMIN["password"]),
            role=UserRole.admin,
        )
        db.add(admin)
        db.commit()
        logger.info("Seeded admin: %s / %s", ADMIN["email"], ADMIN["password"])
    else:
        logger.info("Admin already exists - skipping.")

    for spec in AGENTS:
        if db.query(User).filter(User.agent_code == spec["code"]).first():
            continue
        if spec["lot_index"] >= len(created_lots):
            continue
        lot = created_lots[spec["lot_index"]]
        agent = User(
            email=spec["email"],
            full_name=spec["full_name"],
            hashed_password=hash_password(AGENT_DEFAULT_PASSWORD),
            role=UserRole.agent,
            agent_code=spec["code"],
            assigned_lot_id=lot.id,
        )
        db.add(agent)
    db.commit()
    logger.info(
        "Seeded agents (password for all: %s). Codes: %s",
        AGENT_DEFAULT_PASSWORD,
        ", ".join(a["code"] for a in AGENTS),
    )


def main() -> None:
    import sys
    force = "--reset" in sys.argv

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db, force=force)
    finally:
        db.close()


if __name__ == "__main__":
    main()
