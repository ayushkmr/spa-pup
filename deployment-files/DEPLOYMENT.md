# Puppy Spa Deployment Guide

This guide provides instructions for deploying the Puppy Spa application.

## Prerequisites

- Docker and Docker Compose
- A domain name pointing to your server
- SSL certificate files (for HTTPS)

## SSL Certificate Setup

Before deploying the application, you need to set up SSL certificates:

1. Place your SSL certificate files in the `ssl` directory:
   - `fullchain.pem`: The full certificate chain
   - `privkey.pem`: The private key

If you're using Let's Encrypt, you can obtain certificates using certbot:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Obtain certificates (replace with your domain)
sudo certbot certonly --standalone -d pup-spa.germanywestcentral.cloudapp.azure.com

# Copy certificates to the ssl directory
sudo cp /etc/letsencrypt/live/pup-spa.germanywestcentral.cloudapp.azure.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/pup-spa.germanywestcentral.cloudapp.azure.com/privkey.pem ./ssl/
sudo chmod 644 ./ssl/*.pem
```

## Environment Variables

You can customize the deployment by setting environment variables before running docker-compose:

- `NODE_ENV`: Set to `production` for production builds (default: `development`)
- `DB_USERNAME`: PostgreSQL username (default: `puppy`)
- `DB_PASSWORD`: PostgreSQL password (default: `puppy_spa`)
- `DB_NAME`: PostgreSQL database name (default: `puppy_spa`)
- `DB_PORT`: PostgreSQL port (default: `5432`)
- `PGADMIN_DEFAULT_EMAIL`: pgAdmin email (default: `admin@puppyspa.com`)
- `PGADMIN_DEFAULT_PASSWORD`: pgAdmin password (default: `admin`)
- `PGADMIN_PORT`: pgAdmin port (default: `5050`)

## Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/puppy-spa.git
   cd puppy-spa
   ```

2. Set up SSL certificates as described above.

3. For a production deployment:
   ```bash
   NODE_ENV=production docker-compose up -d
   ```

4. For a development deployment:
   ```bash
   docker-compose up -d
   ```

5. Access the application:
   - Frontend: https://pup-spa.germanywestcentral.cloudapp.azure.com
   - pgAdmin: http://pup-spa.germanywestcentral.cloudapp.azure.com:5050

## Monitoring and Maintenance

- View logs:
  ```bash
  docker-compose logs -f
  ```

- Restart services:
  ```bash
  docker-compose restart [service_name]
  ```

- Stop all services:
  ```bash
  docker-compose down
  ```

- Update the application:
  ```bash
  git pull
  docker-compose down
  docker-compose build
  docker-compose up -d
  ``` 