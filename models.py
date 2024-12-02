from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)  # КодКлиента
    name = Column(String(120), nullable=False)  # ФИО
    phone_number = Column(Integer, nullable=False)  # Номер телефона

    orders = relationship("Order", back_populates="client")


class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)  # КодСотрудника
    name = Column(String(20), nullable=False)  # ФИО
    position = Column(String(20), nullable=False)  # Должность

    orders = relationship("Order", back_populates="employee")


class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)  # КодУслуги
    name = Column(String(120), nullable=False)  # Название

    orders = relationship("Order", back_populates="service")


class Order(Base):
    __tablename__ = "orders"
    id = Column(String(20), primary_key=True, index=True)  # КодЗаказа
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)  # КодКлиента
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)  # КодУслуги
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)  # КодСотрудника
    date = Column(Date, nullable=False)  # ДатаЗаказа

    client = relationship("Client", back_populates="orders")
    service = relationship("Service", back_populates="orders")
    employee = relationship("Employee", back_populates="orders")
