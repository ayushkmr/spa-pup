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
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/next.config.ts /app/next.config.ts

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start the application
CMD ["npm", "start"]

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
