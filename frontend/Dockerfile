FROM node:20-alpine

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
ENV NEXT_PUBLIC_API_URL=http://localhost:3005

# Set the command to run the app in development mode
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

EXPOSE 3000
