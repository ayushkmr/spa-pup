#!/bin/bash

# Deployment script for Puppy Spa
# Usage: ./deploy.sh [dev|prod|latest]
# Example: ./deploy.sh latest

set -e

# Default to latest if no argument is provided
ENV=${1:-latest}

# Load environment variables
ENV_FILE=".env"
if [ "$ENV" != "latest" ]; then
  ENV_FILE=".env.${ENV}"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Environment file $ENV_FILE not found!"
  echo "Creating from .env.example..."
  cp .env.example "$ENV_FILE"
  echo "Please edit $ENV_FILE with the correct values and run the script again."
  exit 1
fi

# Pull the images
./pull-images.sh $ENV

# Start the containers with the correct environment file
docker-compose --env-file "$ENV_FILE" down
docker-compose --env-file "$ENV_FILE" up -d

echo "Deployment completed successfully!"
echo "Application should be available at http://localhost" 