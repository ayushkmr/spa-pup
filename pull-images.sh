#!/bin/bash

# Script to pull Docker images from GitHub Container Registry
# Usage: ./pull-images.sh [dev|prod|latest]
# Example: ./pull-images.sh latest

set -e

# Default to latest if no argument is provided
ENV=${1:-latest}

# Set repository name and registry
REPO_NAME="ayushkmr/spa-pup"
REGISTRY="ghcr.io"

# Set image tags based on environment
BACKEND_IMAGE="${REGISTRY}/${REPO_NAME}-backend:${ENV}"
FRONTEND_IMAGE="${REGISTRY}/${REPO_NAME}-frontend:${ENV}"
echo "Pulling images with tag: ${ENV}"

# Pull the images
echo "Pulling backend image: ${BACKEND_IMAGE}"
docker pull ${BACKEND_IMAGE}

echo "Pulling frontend image: ${FRONTEND_IMAGE}"
docker pull ${FRONTEND_IMAGE}

# Export the image names as environment variables for docker-compose
export BACKEND_IMAGE=${BACKEND_IMAGE}
export FRONTEND_IMAGE=${FRONTEND_IMAGE}

echo "Images pulled successfully!"
echo "To use these images with docker-compose, run:"
echo "  BACKEND_IMAGE=${BACKEND_IMAGE} FRONTEND_IMAGE=${FRONTEND_IMAGE} docker-compose up -d" 