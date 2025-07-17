# Craftsman Service Backend API

Backend service for online craftsman booking system built with Express.js, TypeScript, and PostgreSQL.

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

1. Clone the repository
```bash
git clone <repository-url>
cd express-typescript
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
DB_NAME=craftsman_service

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

4. Create PostgreSQL database
```sql
CREATE DATABASE craftsman_service;
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

## Database Schema

### Users Table
- `id` - Primary key
- `fullname` - User's full name
- `cellphone` - Phone number (unique)
- `email` - Email address (unique)
- `role` - User role (customer/admin)
- `password` - Hashed password
- `created_at`, `updated_at` - Timestamps

### Workers Table
- `id` - Primary key
- `worker_name` - Worker's name/type
- `price` - Daily price
- `created_at`, `updated_at` - Timestamps

### Orders Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `start_date` - Order start date
- `end_date` - Order end date
- `total_day` - Total days
- `status` - Order status (paid/active/completed/cancel)
- `total_price` - Total price
- `created_at`, `updated_at` - Timestamps

### Order_Workers Table
- `id` - Primary key
- `order_id` - Foreign key to orders
- `worker_id` - Foreign key to workers
- Junction table for many-to-many relationship

## Cron Jobs

The system includes two automatic cron jobs:

1. **Orders Activation** (7:00 AM WIB daily)
   - Updates orders from 'paid' to 'active' when start_date matches current date

2. **Orders Completion** (5:00 PM WIB daily)
   - Updates orders from 'active' to 'completed' when end_date matches current date

## Testing

Run tests with:
```bash
pnpm test
```

Run tests with coverage:
```bash
pnpm test:cov
```

## Building for Production

Build the application:
```bash
pnpm build
```

Start in production mode:
```bash
pnpm start:prod
```

## API Documentation

When running the server, API documentation is available at:
- Swagger UI: `http://localhost:8080/`

## Sample Data

After running seeds, you'll have these sample workers:
- Tukang Pipa (200,000/day)
- Tukang Cat (250,000/day)
- Tukang Besi (300,000/day)

## Project Structure

```
src/
├── api/
│   ├── auth/           # Authentication endpoints
│   ├── workers/        # Workers management
│   ├── orders/         # Order management
│   └── ...
├── common/
│   ├── middleware/     # Express middleware
│   ├── models/         # Common models
│   └── utils/          # Utility functions
├── database/
│   ├── migrations/     # Database migrations
│   └── seeds/          # Database seeds
└── ...
```
