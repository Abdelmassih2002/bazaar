from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import Cart, CartItem, Product, User
from app.schemas import CartItemAdd
from app.dependencies import get_current_user, require_role

router = APIRouter()


def _get_or_create_cart(db: Session, user: User) -> Cart:
    cart = db.query(Cart).filter(Cart.retailer_id == user.id).first()
    if cart is None:
        cart = Cart(retailer_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


@router.get("")
def get_cart(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cart = _get_or_create_cart(db, user)
    items = []
    for ci in cart.items:
        items.append({
            "id": str(ci.id),
            "product_id": str(ci.product_id),
            "quantity": ci.quantity,
            "product": {
                "id": str(ci.product.id),
                "name": ci.product.name,
                "price": float(ci.product.price),
                "stock": ci.product.stock,
                "moq": ci.product.moq,
                "images": ci.product.images.split(",") if ci.product.images else [],
            },
        })
    return {"id": str(cart.id), "items": items}


@router.post("/items", status_code=status.HTTP_201_CREATED)
def add_item(
    payload: CartItemAdd,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if payload.quantity < product.moq:
        raise HTTPException(status_code=400, detail=f"Minimum order quantity is {product.moq}")
    if payload.quantity > product.stock:
        raise HTTPException(status_code=400, detail="Not enough stock")
    cart = _get_or_create_cart(db, user)
    existing = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == payload.product_id).first()
    if existing:
        existing.quantity += payload.quantity
        if existing.quantity > product.stock:
            raise HTTPException(status_code=400, detail="Not enough stock")
        db.commit()
        db.refresh(existing)
        return {"id": str(existing.id), "product_id": str(existing.product_id), "quantity": existing.quantity}
    item = CartItem(cart_id=cart.id, product_id=payload.product_id, quantity=payload.quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": str(item.id), "product_id": str(item.product_id), "quantity": item.quantity}


@router.patch("/items/{item_id}")
def update_item(
    item_id: UUID,
    quantity: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = db.get(CartItem, item_id)
    if not item or item.cart.retailer_id != user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    if quantity < item.product.moq:
        raise HTTPException(status_code=400, detail=f"Minimum order quantity is {item.product.moq}")
    if quantity > item.product.stock:
        raise HTTPException(status_code=400, detail="Not enough stock")
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return {"id": str(item.id), "quantity": item.quantity}


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = db.get(CartItem, item_id)
    if not item or item.cart.retailer_id != user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
