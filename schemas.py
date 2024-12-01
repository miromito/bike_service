from pydantic import BaseModel


class ClientBase(BaseModel):
    name: str
    phone_number: str


class ClientCreate(ClientBase):
    pass


class Client(ClientBase):
    id: int

    class Config:
        orm_mode = True


class EmployeeBase(BaseModel):
    name: str
    position: str


class EmployeeCreate(EmployeeBase):
    pass


class Employee(EmployeeBase):
    id: int

    class Config:
        orm_mode = True


class ServiceBase(BaseModel):
    name: str


class ServiceCreate(ServiceBase):
    pass


class Service(ServiceBase):
    id: int

    class Config:
        orm_mode = True
