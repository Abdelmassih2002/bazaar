from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import Product, User
from app.schemas import ProductCreate, ProductOut
from app.dependencies import get_current_user, require_role

router = APIRouter()


@router.get("", response_model=list[ProductOut])
def list_products(
    q: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(Product.category_id == category)
    return query.order_by(Product.created_at.desc()).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: UUID, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("wholesaler", "admin")),
):
    product = Product(
        wholesaler_id=user.id,
        name=payload.name,
        description=payload.description,
        price=payload.price,
        stock=payload.stock,
        moq=payload.moq,
        category_id=payload.category_id,
        images=",".join(payload.images),
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: UUID,
    payload: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("wholesaler", "admin")),
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.wholesaler_id != user.id and user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not your product")
    product.name = payload.name
    product.description = payload.description
    product.price = payload.price
    product.stock = payload.stock
    product.moq = payload.moq
    product.category_id = payload.category_id
    product.images = ",".join(payload.images)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("wholesaler", "admin")),
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.wholesaler_id != user.id and user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not your product")
    db.delete(product)
    db.commit()
