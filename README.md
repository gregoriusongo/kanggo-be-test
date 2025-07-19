# Kanggo Service Backend API

## Features

- **User Authentication**
  - Customer registration
  - Login with email or cellphone
  - JWT-based authentication
  - Role-based access control (customer/admin)

- **Workers Management**
  - List available workers (public)
  - CRUD operations for workers (admin only)

- **Order Management**
  - Create orders with multiple workers
  - View order history
  - Cancel orders
  - Automatic order status updates via cron jobs

- **Scheduling**
  - Availability checking for workers
  - Automatic status updates (paid → active → completed)

## Tech Stack

- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Knex.js
- **Authentication**: JWT
- **Scheduling**: node-cron
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## API Endpoints

### Authentication

- `POST /api/v1/register` - Register new customer
- `POST /api/v1/login` - Login with email/cellphone

### Workers

- `GET /api/v1/workers` - Get all workers (public)
- `GET /api/v1/workers/admin` - Get all workers with full details (admin only)
- `POST /api/v1/workers/admin` - Create new worker (admin only)
- `PUT /api/v1/workers/admin/:id` - Update worker (admin only)
- `DELETE /api/v1/workers/admin/:id` - Delete worker (admin only)

### Orders

- `POST /api/v1/orders` - Create new order (customer only)
- `GET /api/v1/orders` - Get user's orders (customer only)
- `PUT /api/v1/orders/cancel_order/:order_id` - Cancel order (customer only)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- pnpm (package manager)

### Installation

#### Option 1: Docker Installation (Recommended)

1. Clone the repository

```bash
git clone https://github.com/gregoriusongo/kanggo-be-test
cd kanggo-be-test
```

2. Start the application with Docker Compose

```bash
docker compose up -d
```

This will start:

- PostgreSQL database on port `5432`
- Express TypeScript application on port `8080`
- pgAdmin (optional) on port `5050` for database management

The application will automatically:

- Set up the database schema
- Run migrations
- Seed initial data
- Handle database connection retries

Access the API at `http://localhost:8080`

#### Option 2: Manual Installation

1. Clone the repository

```bash
git clone (https://github.com/gregoriusongo/kanggo-be-test
cd kanggo-be-test
```

2. Install dependencies

```bash
pnpm install
```

3. Setup environment variables

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials and JWT secret:

```env
NODE_ENV=development
HOST=localhost
PORT=8080
CORS_ORIGIN=http://localhost:8080

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=kanggo-be

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

4. Create PostgreSQL database

```sql
CREATE DATABASE kanggo-be;
```

5. Run database migrations

```bash
pnpm migrate:latest
```

6. Seed the database with sample workers

```bash
pnpm seed:run
```

7. Start the development server

```bash
pnpm start:dev
```

The API will be available at `http://localhost:8080`
