#!/bin/bash

# Script to build and push Docker images to GitHub Container Registry
# Usage: ./build-push-images.sh [dev|prod]

# Default to dev if no argument is provided
ENV=${1:-dev}
TAG=${ENV}

# Map environment to Docker target stage
if [ "$ENV" = "dev" ]; then
  BACKEND_TARGET="development"
  FRONTEND_TARGET="development"
else
  BACKEND_TARGET="production"
  FRONTEND_TARGET="production"
fi

# Set repository name
REPO_NAME="ayushkmr/spa-pup"
REGISTRY="ghcr.io"

# Set image names
BACKEND_IMAGE="${REGISTRY}/${REPO_NAME}-backend:${TAG}"
FRONTEND_IMAGE="${REGISTRY}/${REPO_NAME}-frontend:${TAG}"

echo "Building and pushing images with tag: ${TAG}"
echo "Backend target: ${BACKEND_TARGET}, Frontend target: ${FRONTEND_TARGET}"

# Create builder instance if it doesn't exist
if ! docker buildx inspect mybuilder &>/dev/null; then
  echo "Creating Docker Buildx builder instance..."
  docker buildx create --name mybuilder --use
fi

# Build and push backend image
echo "Building and pushing backend image: ${BACKEND_IMAGE}"
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag ${BACKEND_IMAGE} \
  --push \
  --file ./backend/Dockerfile \
  --target ${BACKEND_TARGET} \
  ./backend

# Build and push frontend image
echo "Building and pushing frontend image: ${FRONTEND_IMAGE}"
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag ${FRONTEND_IMAGE} \
  --push \
  --file ./frontend/Dockerfile \
  --target ${FRONTEND_TARGET} \
  --build-arg NEXT_PUBLIC_API_URL=/api/ \
  ./frontend

echo "Done building and pushing images!"
echo "To use these images, run:"
echo "  docker-compose --env-file .env.${ENV} up -d"
