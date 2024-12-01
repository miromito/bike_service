from sqlalchemy.orm import Session
import models, schemas


# Клиенты
def get_clients(db: Session):
    return db.query(models.Client).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


# Услуги
def get_services(db: Session):
    return db.query(models.Service).all()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service


# Заказы
def get_orders(db: Session):
    return db.query(models.Order).all()


def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
