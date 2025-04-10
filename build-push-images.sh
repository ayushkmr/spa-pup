#!/bin/bash

# Script to build and push Docker images to GitHub Container Registry
# Usage: ./build-push-images.sh [dev|prod]

set -e

# Default to dev if no argument is provided
ENV=${1:-dev}
TAG=${ENV}

# Get the short SHA of the current commit
SHA=$(git rev-parse --short HEAD)
SHA_TAG="sha-${SHA}"

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

# Set image names with environment, SHA, and latest tags
BACKEND_IMAGE="${REGISTRY}/${REPO_NAME}-backend:${TAG}"
FRONTEND_IMAGE="${REGISTRY}/${REPO_NAME}-frontend:${TAG}"
BACKEND_IMAGE_SHA="${REGISTRY}/${REPO_NAME}-backend:${SHA_TAG}"
FRONTEND_IMAGE_SHA="${REGISTRY}/${REPO_NAME}-frontend:${SHA_TAG}"
BACKEND_IMAGE_LATEST="${REGISTRY}/${REPO_NAME}-backend:latest"
FRONTEND_IMAGE_LATEST="${REGISTRY}/${REPO_NAME}-frontend:latest"

echo "Building and pushing images with tags: ${TAG}, ${SHA_TAG}, and latest"
echo "Backend target: ${BACKEND_TARGET}, Frontend target: ${FRONTEND_TARGET}"

# Check if Docker Buildx is installed
if ! docker buildx version &>/dev/null; then
  echo "Docker Buildx not found. Please install Docker Buildx first."
  exit 1
fi

# Create builder instance if it doesn't exist
if ! docker buildx inspect mybuilder &>/dev/null; then
  echo "Creating Docker Buildx builder instance..."
  docker buildx create --name mybuilder --use
fi

# Ensure builder is running
docker buildx inspect mybuilder --bootstrap

# Build and push backend image with all tags
echo "Building and pushing backend image with multiple tags"
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag ${BACKEND_IMAGE} \
  --tag ${BACKEND_IMAGE_SHA} \
  --tag ${BACKEND_IMAGE_LATEST} \
  --push \
  --file ./backend/Dockerfile \
  --target ${BACKEND_TARGET} \
  ./backend

# Build and push frontend image with all tags
echo "Building and pushing frontend image with multiple tags"
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag ${FRONTEND_IMAGE} \
  --tag ${FRONTEND_IMAGE_SHA} \
  --tag ${FRONTEND_IMAGE_LATEST} \
  --push \
  --file ./frontend/Dockerfile \
  --target ${FRONTEND_TARGET} \
  --build-arg NEXT_PUBLIC_API_URL=/api/ \
  ./frontend

echo "Done building and pushing images!"
echo "To use these images, run:"
echo "  docker-compose --env-file .env.${ENV} up -d"
echo ""
echo "Or pull the images directly with:"
echo "  docker pull ${BACKEND_IMAGE}"
echo "  docker pull ${FRONTEND_IMAGE}"
echo "  docker pull ${BACKEND_IMAGE_LATEST}"
echo "  docker pull ${FRONTEND_IMAGE_LATEST}"
