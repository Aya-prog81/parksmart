"""Authentication endpoints: register, login (user/agent), me."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import User, UserRole
from app.schemas import (
    AgentLogin,
    Token,
    UserLogin,
    UserOut,
    UserRegister,
)
from app.security import create_access_token, hash_password, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)) -> Token:
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )
    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        role=UserRole.user,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id, {"role": user.role.value})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(user.id, {"role": user.role.value})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/agent/login", response_model=Token)
def agent_login(payload: AgentLogin, db: Session = Depends(get_db)) -> Token:
    user = (
        db.query(User)
        .filter(User.agent_code == payload.agent_code.upper())
        .first()
    )
    if not user or user.role != UserRole.agent:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid agent code or password",
        )
    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid agent code or password",
        )
    token = create_access_token(user.id, {"role": user.role.value})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def read_me(user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(user)
