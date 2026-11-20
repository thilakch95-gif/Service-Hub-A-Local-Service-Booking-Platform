
# Service Hub – Local Service Booking Platform

A full-stack web application that helps users find and book local service providers such as plumbers, electricians, and cleaning professionals.

## Features

- User registration and login
- Browse available local services
- Book services through the platform
- Manage bookings through dashboards
- Reviews and ratings for services
- Secure authentication
- Responsive user interface

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- REST APIs
- JWT

### Database
- PostgreSQL
- MySQL (used during development)

### Tools & Deployment
- Eclipse IDE
- Visual Studio Code
- Maven
- Git and GitHub
- Render (deployment)

## Project Structure

```text
Service-Hub/
│
├── backend/
│   ├── src/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── database/
├── render.yaml
└── README.md
```

## How It Works

1. Users register or log in to the platform.
2. Users browse available local services.
3. Users select a service and place a booking.
4. Service providers manage their bookings.
5. Users can provide reviews and ratings.

## Installation and Setup

### Prerequisites
- Java 17 or later
- Node.js and npm
- PostgreSQL
- Maven

### 1. Clone the Repository

```bash
git clone https://github.com/thilakch95-gif/Service-Hub-A-Local-Service-Booking-Platform.git
cd Service-Hub-A-Local-Service-Booking-Platform
```

### 2. Run the Backend

Open the `backend` folder and configure your database connection and required environment variables.

Run:

```bash
mvn spring-boot:run
```

### 3. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Database Configuration

Configure your PostgreSQL database connection in the backend application configuration.

Keep database credentials, JWT secrets, and other sensitive values in environment variables. Do not commit passwords or secret keys to GitHub.

## Future Improvements

- Improve the user interface and user experience
- Add more service categories
- Enhance booking management
- Improve deployment and application performance

## Author

**Thilak**

- GitHub: https://github.com/thilakch95-gif
- LinkedIn: https://www.linkedin.com/in/ch-thilak-70500a390
