from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_serializer


class ProductCreate(BaseModel):
    """Payload for `POST /admin/catalog/products`."""

    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(min_length=1, max_length=80, description="URL-safe slug, e.g. `automated-mug`.")
    name: str = Field(min_length=1, max_length=200)
    price: Decimal = Field(ge=0, description="Unit price in USD.")
    category: str = Field(min_length=1, max_length=80)
    tagline: str = Field(default="", max_length=240)
    replacement_likelihood: int = Field(
        default=0,
        ge=0,
        le=100,
        validation_alias="replacementLikelihood",
        serialization_alias="replacementLikelihood",
    )
    image: str = Field(
        default="",
        max_length=400,
        validation_alias="image",
        serialization_alias="image",
        description="Path to the product image, e.g. `/product-mug.png`.",
    )
    collection: str = Field(
        min_length=1,
        max_length=80,
        validation_alias="collection",
        serialization_alias="collection",
        description="Slug of an existing collection.",
    )


class ProductUpdate(BaseModel):
    """Payload for `PUT /admin/catalog/products/{id}` — all fields optional."""

    model_config = ConfigDict(populate_by_name=True)

    name: str | None = Field(default=None, min_length=1, max_length=200)
    price: Decimal | None = Field(default=None, ge=0)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    tagline: str | None = Field(default=None, max_length=240)
    replacement_likelihood: int | None = Field(
        default=None,
        ge=0,
        le=100,
        validation_alias="replacementLikelihood",
        serialization_alias="replacementLikelihood",
    )
    image: str | None = Field(default=None, max_length=400)
    collection: str | None = Field(
        default=None,
        min_length=1,
        max_length=80,
    )


class ProductRead(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "automated-mug",
                "name": "This Could've Been Automated Mug",
                "price": 28.0,
                "category": "Mugs",
                "tagline": "Your morning ritual, soon to be optimized.",
                "replacementLikelihood": 87,
                "image": "/product-mug.png",
                "collection": "ai-does-it-better",
            }
        },
    )

    id: str = Field(description="URL-safe slug uniquely identifying the product.")
    name: str = Field(description="Display name shown in the storefront.")
    price: Decimal = Field(description="Unit price in USD, serialized as a JSON number.")
    category: str = Field(description="Top-level merchandising category, e.g. `Apparel`.")
    tagline: str = Field(description="Short marketing line for product cards.")
    replacement_likelihood: int = Field(
        serialization_alias="replacementLikelihood",
        description="Tongue-in-cheek 0–100 score of how replaceable the artifact is.",
        ge=0,
        le=100,
    )
    image: str = Field(
        validation_alias="image_url",
        description="Path to the product image relative to the web app `public/` directory.",
    )
    collection: str = Field(
        validation_alias="collection_id",
        description="Slug of the collection this product belongs to.",
    )

    @field_serializer("price")
    def _serialize_price(self, value: Decimal) -> float:
        return float(value)
