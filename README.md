# Bike Service Management System

A basic bike service management system built using **FastAPI** for the backend and **Vue.js** (CDN version) for the
frontend. This project allows managing clients, employees, services, and orders.

---

## Features

- Manage **Clients**, **Employees**, **Services**, and **Orders**.
- Add, delete, and view entries for all entities.
- Error handling for linked data (e.g., prevent deletion of clients linked to orders).

---

## Prerequisites

Before running the project locally, ensure you have the following installed:

- Python 3.10 or higher
- PostgreSQL
- `pipenv` (for managing Python dependencies)

---

## Setup Instructions

#### Clone the Repo, install dependencies

```
pipenv install
psql -U postgres
CREATE DATABASE bike_service;
CREATE USER bike_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE bike_service TO bike_user;
DATABASE_URL = "postgresql://bike_user:password@localhost/bike_service"
```

#### to start fastapi:

```bash
pipenv run start
```

