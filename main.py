from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, get_db
import crud, models, schemas
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)
# Создание таблиц
Base.metadata.create_all(bind=engine)

app = FastAPI()


# Маршруты для клиентов
@app.get("/clients/", response_model=list[schemas.Client])
def read_clients(db: Session = Depends(get_db)):
    return crud.get_clients(db)


@app.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db, client)


# Маршруты для сотрудников
@app.get("/employees/", response_model=list[schemas.Employee])
def read_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)


@app.post("/employees/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db, employee)


# Маршруты для услуг
@app.get("/services/", response_model=list[schemas.Service])
def read_services(db: Session = Depends(get_db)):
    return crud.get_services(db)


@app.post("/services/", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db, service)
