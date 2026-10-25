from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import Order, OrderItem, Cart, CartItem, Product, User
from app.dependencies import get_current_user, require_role

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
def place_order(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cart = db.query(Cart).filter(Cart.retailer_id == user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    # group items by wholesaler
    by_wholesaler: dict = {}
    for ci in cart.items:
        by_wholesaler.setdefault(ci.product.wholesaler_id, []).append(ci)
    created_orders = []
    for wholesaler_id, items in by_wholesaler.items():
        total = sum(float(ci.product.price) * ci.quantity for ci in items)
        order = Order(retailer_id=user.id, wholesaler_id=wholesaler_id, total=total, status="pending")
        db.add(order)
        db.flush()
        for ci in items:
            oi = OrderItem(order_id=order.id, product_id=ci.product_id, quantity=ci.quantity, unit_price=ci.product.price)
            db.add(oi)
            # decrement stock
            ci.product.stock -= ci.quantity
        created_orders.append(order)
        # clear cart items for this wholesaler's products
    # clear entire cart
    for ci in list(cart.items):
        db.delete(ci)
    db.commit()
    for o in created_orders:
        db.refresh(o)
    return [{"id": str(o.id), "total": float(o.total), "status": o.status.value, "wholesaler_id": str(o.wholesaler_id)} for o in created_orders]


@router.get("")
def list_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role.value == "retailer":
        orders = db.query(Order).filter(Order.retailer_id == user.id).order_by(Order.created_at.desc()).all()
    elif user.role.value == "wholesaler":
        orders = db.query(Order).filter(Order.wholesaler_id == user.id).order_by(Order.created_at.desc()).all()
    else:
        orders = db.query(Order).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = []
        for oi in o.items:
            items.append({
                "id": str(oi.id),
                "product_id": str(oi.product_id),
                "product_name": oi.product.name,
                "quantity": oi.quantity,
                "unit_price": float(oi.unit_price),
            })
        result.append({
            "id": str(o.id),
            "retailer_id": str(o.retailer_id),
            "wholesaler_id": str(o.wholesaler_id),
            "status": o.status.value,
            "total": float(o.total),
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "items": items,
        })
    return result


@router.get("/{order_id}")
def get_order(order_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if user.role.value == "retailer" and order.retailer_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if user.role.value == "wholesaler" and order.wholesaler_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    items = [{"id": str(oi.id), "product_id": str(oi.product_id), "product_name": oi.product.name, "quantity": oi.quantity, "unit_price": float(oi.unit_price)} for oi in order.items]
    return {"id": str(order.id), "retailer_id": str(order.retailer_id), "wholesaler_id": str(order.wholesaler_id), "status": order.status.value, "total": float(order.total), "created_at": order.created_at.isoformat() if order.created_at else None, "items": items}


@router.patch("/{order_id}/status")
def update_status(
    order_id: UUID,
    status_value: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("wholesaler", "admin")),
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if user.role.value == "wholesaler" and order.wholesaler_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    allowed = {"pending", "accepted", "shipped", "delivered", "cancelled"}
    if status_value not in allowed:
        raise HTTPException(status_code=400, detail="Invalid status")
    order.status = status_value
    db.commit()
    db.refresh(order)
    return {"id": str(order.id), "status": order.status.value}
