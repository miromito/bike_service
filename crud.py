import time
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
import schemas


# Клиенты
def get_client(db: Session, client_id):
    query = text("SELECT * FROM clients WHERE id = :id")
    result = db.execute(query, {"id": client_id})
    return result.mappings().first()


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


def delete_client(db: Session, client_id: int):
    query = text("DELETE FROM clients WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": client_id})
    db.commit()
    return result.mappings().first()


def update_client(db: Session, client_id: int, client: schemas.ClientCreate):
    query = text(
        "UPDATE clients SET name = :name, phone_number = :phone_number WHERE id = :id RETURNING *"
    )
    result = db.execute(query, {"id": client_id, "name": client.name, "phone_number": client.phone_number})
    db.commit()
    return result.mappings().first()


# Сотрудники
def get_employee(db: Session, employee_id):
    query = text("SELECT * FROM employees WHERE id = :id")
    result = db.execute(query, {"id": employee_id})
    return result.mappings().first()


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


def delete_employee(db: Session, employee_id: int):
    query = text("DELETE FROM employees WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": employee_id})
    db.commit()
    return result.mappings().first()


def update_employee(db: Session, employee_id: int, employee: schemas.EmployeeCreate):
    query = text(
        "UPDATE employees SET name = :name, position = :position WHERE id = :id RETURNING *"
    )
    result = db.execute(query, {"id": employee_id, "name": employee.name, "position": employee.position})
    db.commit()
    return result.mappings().first()


# Услуги
def get_services(db: Session):
    query = text("SELECT * FROM services")
    result = db.execute(query)
    return [dict(row) for row in result.mappings()]


def get_service(db: Session, service_id):
    query = text("SELECT * FROM services WHERE id = :id")
    result = db.execute(query, {"id": service_id})
    return result.mappings().first()


def create_service(db: Session, service: schemas.ServiceCreate):
    query = text(
        "INSERT INTO services (name, price) VALUES (:name, :price) RETURNING *"
    )
    result = db.execute(query, {"name": service.name, "price": service.price})
    db.commit()
    return result.mappings().first()

def update_service(db: Session, service_id: int, service: schemas.ServiceCreate):
    query = text(
        "UPDATE services SET name = :name, price = :price WHERE id = :id RETURNING *"
    )
    result = db.execute(query, {"id": service_id, "name": service.name, "price": service.price})
    db.commit()
    return result.mappings().first()


def delete_service(db: Session, service_id: int):
    query = text("DELETE FROM services WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": service_id})
    db.commit()
    return result.mappings().first()


# Заказы
def get_orders(db: Session):
    query = text("SELECT * FROM orders")
    result = db.execute(query)
    return [dict(row) for row in result.mappings()]


def get_order(db: Session, order_id: str):
    query = text("SELECT * FROM orders WHERE id = id")
    result = db.execute(query, {"id": order_id})
    return result.mappings().first()


def create_order(db: Session, order: schemas.OrderCreate):
    # Генерация уникального Order ID
    order_id = f"ORD-{int(time.time() * 1000)}"

    query = text(
        """
        INSERT INTO orders (id, client_id, service_id, employee_id, date)
        VALUES (:id, :client_id, :service_id, :employee_id, :date)
        RETURNING *
        """
    )
    result = db.execute(
        query,
        {
            "id": order_id,
            "client_id": order.client_id,
            "service_id": order.service_id,
            "employee_id": order.employee_id,
            "date": order.date,
        },
    )
    db.commit()
    return result.mappings().first()


def delete_order(db: Session, order_id: str):
    query = text("DELETE FROM orders WHERE id = :id RETURNING *")
    result = db.execute(query, {"id": order_id})
    db.commit()
    return result.mappings().first()


def update_order(db: Session, order_id: str, order: schemas.OrderCreate):
    try:
        query = text(
            """
            UPDATE orders
            SET client_id = :client_id,
                service_id = :service_id,
                employee_id = :employee_id,
                date = :date
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
                "employee_id": order.employee_id,
                "date": order.date,
            },
        )
        db.commit()
        return result.mappings().first()
    except SQLAlchemyError as e:
        db.rollback()
        raise e
