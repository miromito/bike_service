# Bike Service Management System

A basic bike service management system built using FastAPI for the backend and PostgreSQL for the database. This project allows managing clients, employees, services, and orders.

## Features
- Manage clients, employees, services, and orders.
- Add, delete, update, and view entries for all entities.
- Handles relationships between entities.

## Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Local Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd <your-repository-folder>
   ```

2. **Environment Variables**
   Ensure the `.env` file is present in the root directory with the following content:
   ```env
   DATABASE_URL=postgresql://bike_user:password@db/bike_service
   ```

3. **Build and Start the Application**
   Use Docker Compose to build and start the services:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - FastAPI will be available at: [http://localhost:8000](http://localhost:8000)
   - FastAPI Swagger UI (API documentation): [http://localhost:8000/docs](http://localhost:8000/docs)

5. **Database**
   The PostgreSQL database will be available at `localhost:5432` with the following credentials:
   - Username: `bike_user`
   - Password: `password`
   - Database: `bike_service`

   You can connect to the database using a PostgreSQL client or CLI:
   ```bash
   docker exec -it bike_service_db psql -U bike_user -d bike_service
   ```

6. **Verify Tables**
   After starting the application, the database tables should be created automatically. To verify:
   ```sql
   \dt
   ```
   This will list all tables (`clients`, `employees`, `services`, and `orders`).

## Project Structure
- **`main.py`**: Application entry point.
- **`database.py`**: Database connection and session setup.
- **`models.py`**: SQLAlchemy models defining database tables.
- **`schemas.py`**: Pydantic schemas for request and response validation.
- **`crud.py`**: Database operations.
- **`docker-compose.yml`**: Docker Compose configuration for services.
- **`Dockerfile`**: Instructions for building the FastAPI service image.

## Usage
Once the application is running:
1. Use the Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs) to interact with the API.
2. Add clients, employees, services, and orders using the provided endpoints.

## Cleanup
To stop the application and remove containers:
```bash
docker-compose down
```

To also remove volumes (including the database):
```bash
docker-compose down --volumes
```

---

Feel free to contribute and extend this project. Happy coding!

