from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Payload for `POST /auth/register`."""

    email: EmailStr = Field(description="Account email. Must be unique.")
    password: str = Field(
        min_length=8,
        max_length=128,
        description="Plain-text password. Hashed server-side; never stored or returned.",
    )
    full_name: str | None = Field(
        default=None,
        max_length=120,
        serialization_alias="fullName",
        validation_alias="fullName",
        description="Optional display name.",
    )

    model_config = ConfigDict(populate_by_name=True)


class UserLogin(BaseModel):
    """Payload for `POST /auth/login`."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserRead(BaseModel):
    """Public-facing user shape returned by auth endpoints."""

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "email": "designer@still-employed.com",
                "fullName": "Ada Lovelace",
                "isAdmin": False,
                "createdAt": "2026-05-06T11:35:00+00:00",
            }
        },
    )

    id: int
    email: EmailStr
    full_name: str | None = Field(
        default=None,
        serialization_alias="fullName",
        validation_alias="full_name",
    )
    is_admin: bool = Field(
        default=False,
        serialization_alias="isAdmin",
        validation_alias="is_admin",
    )
    created_at: datetime = Field(
        serialization_alias="createdAt",
        validation_alias="created_at",
    )


class Token(BaseModel):
    """JWT bearer token returned by login/register."""

    access_token: str = Field(serialization_alias="accessToken")
    token_type: str = Field(default="bearer", serialization_alias="tokenType")
    expires_in: int = Field(
        serialization_alias="expiresIn",
        description="Token lifetime in seconds, from issue time.",
    )
    user: UserRead

    model_config = ConfigDict(populate_by_name=True)
