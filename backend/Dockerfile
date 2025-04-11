FROM node:20-alpine AS development

WORKDIR /app

# Copy package files first for better cache utilization
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build for production
RUN npm run build

# Verify that the dist directory is created
RUN ls -la /app/dist

FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files from development stage
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=development /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3005/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3005
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", "dist/src/main.js"]

EXPOSE 3005
