# Docker Setup Guide

This project includes Docker and Docker Compose configuration for easy development and deployment.

## Prerequisites

- Docker and Docker Compose installed on your system
- Clone this repository

## Quick Start

1. **Copy environment variables:**

   ```bash
   cp .env.example .env
   ```

2. **Start all services:**

   ```bash
   # For development
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

   # For production
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
   ```

3. **Run database migrations:**

   ```bash
   # After containers are running
   docker-compose exec app pnpm migrate:latest
   ```

4. **Seed the database (optional):**

   ```bash
   docker-compose exec app pnpm seed:run
   ```

## Services

The Docker Compose setup includes:

- **app**: Express TypeScript application (port 8080)
- **postgres**: PostgreSQL database (port 5432)
- **pgadmin**: Database administration tool (port 5050) - development only

## Available Commands

### Development Mode

```bash
# Start in development mode with hot reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# View logs
docker-compose logs -f app

# Execute commands in the app container
docker-compose exec app pnpm test
docker-compose exec app pnpm migrate:latest
```

### Production Mode

```bash
# Start in production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View production logs
docker-compose logs -f app
```

### Database Management

#### Access PostgreSQL directly

```bash
docker-compose exec postgres psql -U postgres -d craftsman_service
```

#### Access pgAdmin

- URL: <http://localhost:5050>
- Email: <admin@example.com> (configurable in .env)
- Password: admin (configurable in .env)

#### Backup database

```bash
docker-compose exec postgres pg_dump -U postgres craftsman_service > backup.sql
```

#### Restore database

```bash
docker-compose exec -T postgres psql -U postgres craftsman_service < backup.sql
```

## Environment Variables

Key environment variables for Docker setup:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `HOST` | Application host | `0.0.0.0` |
| `PORT` | Application port | `8080` |
| `DB_HOST` | Database host | `postgres` (service name) |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `craftsman_service` |

## Volumes

- `postgres_data`: Persistent PostgreSQL data
- `pgadmin_data`: Persistent pgAdmin configuration
- `app_logs`: Application logs

## Networking

All services run on a custom bridge network `app-network` for secure internal communication.

## Troubleshooting

1. **Port conflicts**: Ensure ports 8080, 5432, and 5050 are not in use
2. **Permission issues**: Make sure Docker has proper permissions
3. **Database connection**: Wait for PostgreSQL health check to pass before starting the app
4. **Container rebuild**: Use `--build` flag to rebuild after code changes

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (this will delete your database!)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```
