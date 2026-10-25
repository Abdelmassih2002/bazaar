from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Order, Product, User
from app.dependencies import require_role

router = APIRouter()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user=Depends(require_role("wholesaler", "admin"))):
    if user.role.value == "wholesaler":
        products = db.query(Product).filter(Product.wholesaler_id == user.id).all()
        orders = db.query(Order).filter(Order.wholesaler_id == user.id).all()
    else:
        products = db.query(Product).all()
        orders = db.query(Order).all()
    total_revenue = sum(float(o.total) for o in orders if o.status.value in ("accepted", "shipped", "delivered"))
    pending_orders = sum(1 for o in orders if o.status.value == "pending")
    low_stock = [p for p in products if p.stock <= 5]
    return {
        "total_products": len(products),
        "total_orders": len(orders),
        "pending_orders": pending_orders,
        "total_revenue": round(total_revenue, 2),
        "low_stock_count": len(low_stock),
        "low_stock_products": [{"id": str(p.id), "name": p.name, "stock": p.stock} for p in low_stock],
    }


@router.get("/low-stock")
def low_stock(db: Session = Depends(get_db), user=Depends(require_role("wholesaler", "admin"))):
    if user.role.value == "wholesaler":
        products = db.query(Product).filter(Product.wholesaler_id == user.id, Product.stock <= 5).all()
    else:
        products = db.query(Product).filter(Product.stock <= 5).all()
    return [{"id": str(p.id), "name": p.name, "stock": p.stock, "wholesaler_id": str(p.wholesaler_id)} for p in products]
