import uuid
from sqlalchemy import Column, String, DateTime, Enum as SAEnum, ForeignKey, Integer, Numeric, Text
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

import enum


class UserRole(str, enum.Enum):
    retailer = "retailer"
    wholesaler = "wholesaler"
    admin = "admin"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.retailer)
    business_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    address = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="wholesaler", cascade="all, delete-orphan")
    cart = relationship("Cart", back_populates="retailer", uselist=False, cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="retailer", foreign_keys="Order.retailer_id")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    parent_id = Column(Uuid(as_uuid=True), ForeignKey("categories.id"), nullable=True)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wholesaler_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False, default="")
    price = Column(Numeric(12, 2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    moq = Column(Integer, nullable=False, default=1)
    category_id = Column(Uuid(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    images = Column(Text, nullable=False, default="")  # comma-separated URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    wholesaler = relationship("User", back_populates="products")
    category = relationship("Category", back_populates="products")


class Cart(Base):
    __tablename__ = "carts"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    retailer = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_id = Column(Uuid(as_uuid=True), ForeignKey("carts.id"), nullable=False)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    wholesaler_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    status = Column(SAEnum(OrderStatus), nullable=False, default=OrderStatus.pending)
    total = Column(Numeric(12, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    retailer = relationship("User", back_populates="orders", foreign_keys=[retailer_id])
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(Uuid(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(12, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
