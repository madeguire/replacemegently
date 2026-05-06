from pydantic import BaseModel, ConfigDict, Field


class CollectionCreate(BaseModel):
    """Payload for `POST /admin/catalog/collections`."""

    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(min_length=1, max_length=80)
    name: str = Field(min_length=1, max_length=160)
    description: str = Field(default="", max_length=600)
    image: str = Field(
        default="",
        max_length=400,
        validation_alias="image",
        serialization_alias="image",
    )


class CollectionUpdate(BaseModel):
    """Payload for `PUT /admin/catalog/collections/{id}` — all fields optional."""

    model_config = ConfigDict(populate_by_name=True)

    name: str | None = Field(default=None, min_length=1, max_length=160)
    description: str | None = Field(default=None, max_length=600)
    image: str | None = Field(default=None, max_length=400)


class CollectionRead(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "ai-does-it-better",
                "name": "For When AI Does It Better",
                "description": "Tools for accepting the inevitable.",
                "itemCount": 2,
                "image": "/product-pixels-hoodie.png",
            }
        },
    )

    id: str = Field(description="URL-safe slug uniquely identifying the collection.")
    name: str = Field(description="Display name of the collection.")
    description: str = Field(description="Short editorial description shown beneath the title.")
    item_count: int = Field(
        serialization_alias="itemCount",
        description="Number of products currently in this collection. Computed on read.",
        ge=0,
    )
    image: str = Field(
        validation_alias="image_url",
        description="Path to the collection cover image relative to the web app `public/` directory.",
    )
