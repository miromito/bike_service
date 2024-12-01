from sqlalchemy.orm import Session
import models, schemas


# Работа с клиентами
def get_clients(db: Session):
    return db.query(models.Client).all()


def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


# Работа с сотрудниками
def get_employees(db: Session):
    return db.query(models.Employee).all()


def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


# Работа с услугами
def get_services(db: Session):
    return db.query(models.Service).all()


def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service
