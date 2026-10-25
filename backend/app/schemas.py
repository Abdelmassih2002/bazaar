from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Literal
from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    business_name: str = Field(min_length=2)
    phone: str = Field(min_length=8)
    role: Literal["retailer", "wholesaler"] = "retailer"
    address: str = ""


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    email: str
    role: str
    business_name: str
    phone: str
    address: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenPair(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ProductCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str = ""
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    moq: int = Field(ge=1, default=1)
    category_id: UUID | None = None
    images: list[str] = []


class ProductOut(BaseModel):
    id: UUID
    wholesaler_id: UUID
    name: str
    description: str
    price: float
    stock: int
    moq: int
    category_id: UUID | None
    images: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("images", mode="before")
    @classmethod
    def split_images(cls, v):
        if isinstance(v, str):
            return [x for x in v.split(",") if x.strip()]
        return v or []


class CartItemAdd(BaseModel):
    product_id: UUID
    quantity: int = Field(ge=1)


class CartItemOut(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int

    model_config = {"from_attributes": True}
