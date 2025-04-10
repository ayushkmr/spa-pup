#!/bin/bash

# Production Deployment Script for Puppy Spa
# This script will pull the production images and start the application

set -e

echo "Starting production deployment..."

# Set environment file
ENV_FILE=".env.production"

# Check if the environment file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found!"
  echo "Please make sure the production environment file exists before deploying."
  exit 1
fi

# Pull the production images
echo "Pulling production images..."
./pull-images.sh prod

# Stop any running containers
echo "Stopping any running containers..."
docker-compose --env-file "$ENV_FILE" down

# Start the containers in production mode
echo "Starting containers in production mode..."
docker-compose --env-file "$ENV_FILE" up -d

echo "Deployment completed!"
echo "Application should be available at the configured URL."
echo ""
echo "To view logs, run: docker-compose --env-file $ENV_FILE logs -f"
echo "To stop the application, run: docker-compose --env-file $ENV_FILE down" 