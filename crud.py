from sqlalchemy import text
from sqlalchemy.orm import Session
import schemas


# Clients
def get_clients(db: Session):
    query = text("SELECT * FROM clients")
    result = db.execute(query)
    return [dict(row) for row in result.mappings()]


def create_client(db: Session, client: schemas.ClientCreate):
    query = text(
        "INSERT INTO clients (name, phone_number) VALUES (:name, :phone_number) RETURNING *"
    )
    result = db.execute(query, {"name": client.name, "phone_number": client.phone_number})
    db.commit()
    return result.mappings().first()


def update_client(db: Session, client_id: int, client: schemas.ClientCreate):
    query = text(
        """
        UPDATE clients
        SET name = :name, phone_number = :phone_number
        WHERE id = :id
        RETURNING *
        """
    )
    result = db.execute(
        query, {"id": client_id, "name": client.name, "phone_number": client.phone_number}
    )
    db.commit()
    return result.mappings().first()


def delete_client(db: Session, client_id: int):
    query = text("DELETE FROM clients WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": client_id})
    db.commit()
    return result.mappings().first()


# Employees
def get_employees(db: Session):
    query = text("SELECT * FROM employees")
    result = db.execute(query)
    return [dict(row) for row in result.mappings()]


def create_employee(db: Session, employee: schemas.EmployeeCreate):
    query = text(
        "INSERT INTO employees (name, position) VALUES (:name, :position) RETURNING *"
    )
    result = db.execute(query, {"name": employee.name, "position": employee.position})
    db.commit()
    return result.mappings().first()


def update_employee(db: Session, employee_id: int, employee: schemas.EmployeeCreate):
    query = text(
        """
        UPDATE employees
        SET name = :name, position = :position
        WHERE id = :id
        RETURNING *
        """
    )
    result = db.execute(
        query, {"id": employee_id, "name": employee.name, "position": employee.position}
    )
    db.commit()
    return result.mappings().first()


def delete_employee(db: Session, employee_id: int):
    query = text("DELETE FROM employees WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": employee_id})
    db.commit()
    return result.mappings().first()


# Services
def get_services(db: Session):
    query = text("SELECT * FROM services")
    result = db.execute(query)
    return [dict(row) for row in result.mappings()]


def create_service(db: Session, service: schemas.ServiceCreate):
    query = text(
        """
        INSERT INTO services (name, description, price)
        VALUES (:name, :description, :price)
        RETURNING *
        """
    )
    result = db.execute(
        query,
        {
            "name": service.name,
            "description": service.description,
            "price": service.price,
        },
    )
    db.commit()
    return result.mappings().first()


def update_service(db: Session, service_id: int, service: schemas.ServiceCreate):
    query = text(
        """
        UPDATE services
        SET name = :name, description = :description, price = :price
        WHERE id = :id
        RETURNING *
        """
    )
    result = db.execute(
        query,
        {
            "id": service_id,
            "name": service.name,
            "description": service.description,
            "price": service.price,
        },
    )
    db.commit()
    return result.mappings().first()


def delete_service(db: Session, service_id: int):
    query = text("DELETE FROM services WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": service_id})
    db.commit()
    return result.mappings().first()


# Orders
def get_orders(db: Session):
    query = text("SELECT * FROM orders")
    result = db.execute(query)
    return [dict(row) for row in result.mappings()]


def create_order(db: Session, order: schemas.OrderCreate):
    query = text(
        """
        INSERT INTO orders (client_id, service_id, date, status)
        VALUES (:client_id, :service_id, :date, :status)
        RETURNING *
        """
    )
    result = db.execute(
        query,
        {
            "client_id": order.client_id,
            "service_id": order.service_id,
            "date": order.date,
            "status": order.status,
        },
    )
    db.commit()
    return result.mappings().first()


def update_order(db: Session, order_id: int, order: schemas.OrderCreate):
    query = text(
        """
        UPDATE orders
        SET client_id = :client_id, service_id = :service_id, date = :date, status = :status
        WHERE id = :id
        RETURNING *
        """
    )
    result = db.execute(
        query,
        {
            "id": order_id,
            "client_id": order.client_id,
            "service_id": order.service_id,
            "date": order.date,
            "status": order.status,
        },
    )
    db.commit()
    return result.mappings().first()


def delete_order(db: Session, order_id: int):
    query = text("DELETE FROM orders WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": order_id})
    db.commit()
    return result.mappings().first()
