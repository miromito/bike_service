from pydantic import BaseModel
from datetime import datetime


# Базовая схема для сотрудников
class EmployeeBase(BaseModel):
    name: str
    position: str


# Схема для создания сотрудника
class EmployeeCreate(EmployeeBase):
    pass


# Схема для вывода данных сотрудника
class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True


# Клиенты
class ClientBase(BaseModel):
    name: str
    phone_number: str

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int

    class Config:
        orm_mode = True


# Услуги
class ServiceBase(BaseModel):
    name: str
    description: str
    price: int


class ServiceCreate(ServiceBase):
    pass


class Service(ServiceBase):
    id: int

    class Config:
        orm_mode = True


# Заказы
class OrderBase(BaseModel):
    client_id: int
    service_id: int
    date: datetime
    status: str


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    id: int

    class Config:
        orm_mode = True
