# Service-Hub-A-Local-Service-Booking-Platform
# Local Service Finder Platform

A production-style full-stack web application for booking local services. It supports three roles:
- **USER**: search and book services.
- **PROVIDER**: publish services and manage booking requests.
- **ADMIN**: monitor users, providers, services, and bookings.

## Monorepo Structure
- `backend/`: Spring Boot REST API with JWT security.
- `frontend/`: React + Tailwind web client.
- `database/`: MySQL schema and ER description.

## Tech Stack
### Backend
- Java 17, Spring Boot 3
- Spring Web, Data JPA, Security, Validation
- JWT (jjwt)
- MySQL
- Lombok

### Frontend
- React + Vite
- React Router
- Axios
- Tailwind CSS
- React Icons
- Chart.js

## Setup
### 1) Database
Run:
```bash
mysql -u root -p < database/schema.sql
```

### 2) Backend
```bash
cd backend
cp .env.example .env
# export env variables from .env or configure your shell
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.
When the frontend runs on a phone or another device over LAN, it automatically calls the backend on the same host at port `8080`.

## Environment Variables
### Backend (`backend/.env.example`)
- `SERVER_PORT`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRATION_MS`

### Frontend
- No API base URL env var is required for normal local or LAN testing.

## API Response Format
```json
{
  "status": 200,
  "message": "Success message",
  "data": {}
}
```

## API Documentation
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Services
- `GET /api/services?category=&location=&page=0&size=10`
- `GET /api/services/{id}`
- `POST /api/services` (PROVIDER)
- `PUT /api/services/{id}` (PROVIDER owner)
- `DELETE /api/services/{id}` (PROVIDER owner)
- `GET /api/services/provider/me` (PROVIDER)

### Bookings
- `POST /api/bookings` (USER)
- `GET /api/bookings/me` (USER)
- `GET /api/bookings/provider/me` (PROVIDER)
- `PATCH /api/bookings/{bookingId}/status` (PROVIDER)

### Admin
- `GET /api/admin/users`
- `GET /api/admin/providers`
- `GET /api/admin/services`
- `GET /api/admin/bookings`

## Example Request Bodies
### Register
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123",
  "role": "USER"
}
```

### Create Service (provider)
```json
{
  "title": "Home Cleaning",
  "description": "Deep cleaning package",
  "category": "Cleaning",
  "price": 120,
  "location": "New York"
}
```

### Create Booking (user)
```json
{
  "serviceId": 1,
  "serviceDate": "2026-01-10",
  "notes": "Morning slot"
}
```

## Deployment Guidelines
### Render
- Deploy backend as web service using `backend/` root, build `mvn package`, start `java -jar target/*.jar`.
- Add MySQL credentials and JWT vars in Render environment settings.
- Deploy frontend as static site from `frontend/`, build `npm run build`, publish `dist`.

### Railway
- Provision MySQL plugin.
- Set backend environment variables from Railway database connection details.
- Deploy frontend separately or via static hosting.

### Netlify (Frontend)
- Base dir: `frontend`
- Build: `npm run build`
- Publish: `frontend/dist`
- Serve the frontend behind the backend host or a reverse proxy so `/api` and `/ws` resolve on the same hostname.

## Screenshots
- Screenshot capture was attempted in this environment, but the frontend dev server could not be started due package registry 403 restrictions.
- Once dependencies install successfully, capture pages from `/login`, `/user`, `/provider`, and `/admin` and embed them here.
