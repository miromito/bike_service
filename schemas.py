from pydantic import BaseModel
from datetime import date
from typing import Optional


# Клиенты
class ClientBase(BaseModel):
    name: str
    phone_number: int


class ClientCreate(ClientBase):
    pass


class Client(ClientBase):
    id: int

    class Config:
        from_attributes = True


# Сотрудники
class EmployeeBase(BaseModel):
    name: str
    position: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True


# Услуги
class ServiceBase(BaseModel):
    name: str

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int

    class Config:
        from_attributes = True


# Заказы
class OrderBase(BaseModel):
    client_id: int
    service_id: int
    employee_id: int
    date: date


class OrderCreate(OrderBase):  # Inherit from OrderBase
    pass

class Order(OrderBase):
    id: str

    class Config:
        from_attributes = True
