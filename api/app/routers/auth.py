from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token(user: User) -> Token:
    access_token, expires_in = create_access_token(subject=str(user.id))
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=expires_in,
        user=UserRead.model_validate(user),
    )


@router.post(
    "/register",
    response_model=Token,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new account",
    description=(
        "Creates a user with a bcrypt-hashed password and immediately returns a JWT access token "
        "alongside the public user record. Returns `409` if the email is already in use."
    ),
    responses={
        409: {
            "description": "Email already registered.",
            "content": {"application/json": {"example": {"detail": "Email already registered"}}},
        },
    },
)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> Token:
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=str(payload.email),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return _issue_token(user)


@router.post(
    "/login",
    response_model=Token,
    response_model_by_alias=True,
    summary="Log in with email + password",
    description=(
        "Verifies credentials and returns a JWT access token plus the public user record. "
        "Returns `401` for unknown emails, wrong passwords, or deactivated accounts."
    ),
    responses={
        401: {
            "description": "Invalid credentials.",
            "content": {"application/json": {"example": {"detail": "Invalid email or password"}}},
        },
    },
)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
        )

    return _issue_token(user)


@router.get(
    "/me",
    response_model=UserRead,
    response_model_by_alias=True,
    summary="Current authenticated user",
    description="Returns the user associated with the bearer token. Requires `Authorization: Bearer <token>`.",
    responses={
        401: {
            "description": "Missing or invalid token.",
            "content": {
                "application/json": {"example": {"detail": "Could not validate credentials"}}
            },
        },
    },
)
def read_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
