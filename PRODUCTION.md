# Production Deployment Guide

This document provides step-by-step instructions for deploying the Puppy Spa application in a production environment using Docker.

## Prerequisites

- Docker (v20.10.0+)
- Docker Compose (v2.0.0+)
- Git
- Access to GitHub Container Registry (GHCR)

## Deployment Steps

### 1. Prepare the Server

Make sure Docker and Docker Compose are installed on your production server:

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version
```

### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/spa-pup.git
cd spa-pup
```

### 3. Configure Environment Variables

The repository includes a `.env.production` file with the necessary configuration for production. Review and update the following values:

- `DB_PASSWORD`: Set a strong password for the database
- `PGADMIN_DEFAULT_PASSWORD`: Set a strong password for pgAdmin
- Any other environment-specific settings

Important security note: Always use strong passwords in production!

### 4. SSL Certificates

For production, you need valid SSL certificates:

```bash
# Create the ssl directory if it doesn't exist
mkdir -p ssl

# Copy your certificates into the ssl directory
# - certificate.crt: Your SSL certificate
# - private.key: Your private key
```

If you don't have certificates yet, you can use Let's Encrypt to obtain free SSL certificates.

## Deployment Options

### Option 1: Using Production Deployment Script (Recommended)

We've provided a dedicated production deployment script:

```bash
# Make the deployment scripts executable
chmod +x deploy-production.sh pull-images.sh

# Run the production deployment script
./deploy-production.sh
```

This script will:
- Check for the existence of .env.production
- Pull the production images from GHCR
- Start the containers with the production configuration

### Option 2: Using General Deployment Script

```bash
# For production deployment
./deploy.sh prod

# This will use the .env.prod file if it exists
```

### Option 3: Manual Deployment

1. Pull the specific images:
   ```bash
   # Pull production images
   ./pull-images.sh prod
   ```

2. Start the containers with the production environment file:
   ```bash
   docker-compose --env-file .env.production up -d
   ```

## Available Image Tags

The following image tags are available for deployment:

- `latest`: Latest build (recommended for testing)
- `prod`: Production-ready build (recommended for production)
- `dev`: Development build
- `sha-{commit}`: Specific commit build (e.g., `sha-d2da96b`)

## After Deployment

### Verify the Deployment

After deployment, verify that all services are running:

```bash
docker-compose --env-file .env.production ps
```

You should see all services (postgres, pgadmin, backend, frontend, nginx) running.

### Access the Application

- The main application should be available at: `https://your-domain.com`
- pgAdmin interface should be available at: `https://your-domain.com:5050`

### Check Logs

To check logs for troubleshooting:

```bash
# View logs for all services
docker-compose --env-file .env.production logs

# View logs for a specific service
docker-compose --env-file .env.production logs backend

# Follow logs in real-time
docker-compose --env-file .env.production logs -f
```

## Database Management

After the first deployment, you may want to disable the automatic database reset:

1. Edit `.env.production` and change `DB_RESET=true` to `DB_RESET=false`
2. Update the `BACKEND_COMMAND` to remove the force reset flag:
   ```
   BACKEND_COMMAND="npx prisma generate && npx prisma db push && npm run start:prod"
   ```

## Updating the Application

To update to the latest version:

1. Pull the latest code changes:
   ```bash
   git pull
   ```

2. Run the deployment script:
   ```bash
   ./deploy-production.sh
   ```

This will pull the latest production images and restart the containers.

## Troubleshooting

- **Issue**: Container fails to start
  **Solution**: Check logs with `docker-compose --env-file .env.production logs`

- **Issue**: Cannot connect to the application
  **Solution**: Verify that all containers are running and check firewall settings

- **Issue**: Database connection issues
  **Solution**: Verify the DATABASE_URL in `.env.production`

- **Issue**: Docker Compose version incompatibility
  **Solution**: Make sure you're using Docker Compose V2

- **Issue**: Permission issues with scripts
  **Solution**: Make sure all scripts are executable with `chmod +x *.sh`

## Maintenance

### Backup

Regularly backup your database:

```bash
docker exec -t puppy-spa-postgres pg_dump -U puppy puppy_spa > backup_$(date +%Y-%m-%d).sql
```

### Restore from Backup

To restore from a backup:

```bash
cat backup_file.sql | docker exec -i puppy-spa-postgres psql -U puppy -d puppy_spa
```

### Monitoring

Consider setting up monitoring for your production deployment using tools like Prometheus and Grafana.

## Security Considerations

1. Use strong passwords in the `.env.production` file
2. Keep your Docker and host system updated with security patches
3. Consider implementing rate limiting for the API
4. Set up firewall rules to only expose necessary ports (80, 443, 5050)
5. Regularly backup your database and configuration
6. Use SSL/TLS for all connections in production 