FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better cache utilization
COPY package*.json ./

# Install dependencies with legacy-peer-deps
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
ARG NEXT_PUBLIC_API_URL=http://localhost:3005
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Log the API URL for debugging
RUN echo "Building with API URL: $NEXT_PUBLIC_API_URL"
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/out /app/out
COPY --from=builder /app/public /app/public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start the application with serve
CMD ["serve", "-s", "out", "-l", "3000"]

EXPOSE 3000

# Development image
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files first for better cache utilization
COPY package*.json ./

# Install dependencies with legacy-peer-deps
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# API URL will be set by docker-compose

# Set the command to run the app in development mode
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

EXPOSE 3000
