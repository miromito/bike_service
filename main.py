from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import Base, engine, get_db
import crud, schemas
from fastapi.middleware.cors import CORSMiddleware

# Вместо миграций, временно - для разработки
# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change "*" to a list of allowed origins if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Клиенты
@app.get("/clients/", response_model=list[schemas.Client])
def read_clients(db: Session = Depends(get_db)):
    return crud.get_clients(db)

@app.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db, client)


@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_client(db, client_id)
    except IntegrityError:
        db.rollback()  # Roll back the session if there's an error
        raise HTTPException(
            status_code=400,
            detail="Cannot delete client because it is referenced in existing orders."
        )

# Сотрудники
@app.get("/employees/", response_model=list[schemas.Employee])
def read_employee(db: Session = Depends(get_db)):
    return crud.get_employees(db)


@app.post("/employees/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db, employee)


@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_employee(db, employee_id)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete employee because they are referenced in existing orders."
        )

# Услуги
@app.get("/services/", response_model=list[schemas.Service])
def read_services(db: Session = Depends(get_db)):
    return crud.get_services(db)

@app.post("/services/", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db, service)


@app.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_service(db, service_id)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete service because it is referenced in existing orders."
        )

# Заказы
@app.get("/orders/", response_model=list[schemas.Order])
def read_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)


@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)


@app.delete("/orders/{order_id}")
def delete_order(order_id: str, db: Session = Depends(get_db)):
    return crud.delete_order(db, order_id)
