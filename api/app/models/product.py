from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.collection import Collection


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    tagline: Mapped[str] = mapped_column(String, nullable=False, default="")
    replacement_likelihood: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    image_url: Mapped[str] = mapped_column(String, nullable=False, default="")
    collection_id: Mapped[str] = mapped_column(
        ForeignKey("collections.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    collection: Mapped[Collection] = relationship("Collection", back_populates="products")
