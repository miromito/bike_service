from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import Base, engine, get_db
import crud, schemas
from fastapi.middleware.cors import CORSMiddleware
import models
import csv
from io import StringIO
from fastapi.responses import StreamingResponse

# Вместо миграций, временно - для разработки
import time
from sqlalchemy.exc import OperationalError

# Retry creating tables if the database is not ready
MAX_RETRIES = 5
WAIT_TIME = 5  # seconds


def initialize_database():
    retries = 0
    while retries < MAX_RETRIES:
        try:
            print("Creating database tables...")
            Base.metadata.create_all(bind=engine)
            print("Database tables created successfully.")
            break
        except OperationalError as e:
            print(f"Database not ready, retrying in {WAIT_TIME} seconds... ({retries + 1}/{MAX_RETRIES})")
            retries += 1
            time.sleep(WAIT_TIME)
    if retries == MAX_RETRIES:
        print("Failed to initialize database after retries.")
        raise RuntimeError("Database initialization failed.")


# Call the initialization function
initialize_database()

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


@app.put("/clients/{client_id}")
def update_client(client_id: int, client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.update_client(db, client_id, client)


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


@app.put("/employees/{employee_id}")
def update_employee(employee_id: int, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.update_employee(db, employee_id, employee)


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


@app.put("/services/{service_id}")
def update_service(service_id: int, service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.update_service(db, service_id, service)


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


@app.put("/orders/{order_id}")
def update_order(order_id: str, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        return crud.update_order(db, order_id, order)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to update order: {str(e)}")


@app.get("/orders/{order_id}/invoice")
def generate_invoice(order_id: str, db: Session = Depends(get_db)):
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    client = crud.get_client(db, order["client_id"])
    service = crud.get_service(db, order["service_id"])
    employee = crud.get_employee(db, order["employee_id"])

    return {
        "Order ID": order["id"],
        "Client": client["name"],
        "Service": service["name"],
        "Price": service["price"],
        "Employee": employee["name"],
        "Date": order["date"]
    }


@app.get("/orders/report")
def generate_total_report(db: Session = Depends(get_db)):
    orders = crud.get_orders(db)
    clients = crud.get_clients(db)
    services = crud.get_services(db)

    # Prepare CSV content
    csv_data = StringIO()
    writer = csv.writer(csv_data)
    writer.writerow(["Client Name", "Order ID", "Service Name", "Price", "Employee Name", "Date", "Total Amount"])

    # Map to store total amounts per client
    client_totals = {}

    for order in orders:
        client = next(c for c in clients if c["id"] == order["client_id"])
        service = next(s for s in services if s["id"] == order["service_id"])
        employee = next(e for e in crud.get_employees(db) if e["id"] == order["employee_id"])

        # Update total amount per client
        client_totals[client["id"]] = client_totals.get(client["id"], 0) + service["price"]

        writer.writerow([
            client["name"], order["id"], service["name"], service["price"],
            employee["name"], order["date"], client_totals[client["id"]]
        ])

    # Write total amounts per client at the end
    writer.writerow([])
    writer.writerow(["Client Totals"])
    for client_id, total in client_totals.items():
        client_name = next(c["name"] for c in clients if c["id"] == client_id)
        writer.writerow([client_name, "", "", "", "", "", total])

    csv_data.seek(0)
    return StreamingResponse(
        iter([csv_data.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=total_report.csv"}
    )
