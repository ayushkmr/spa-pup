# 🐶 Puppy Spa Waiting List App

A full-stack web application to manage daily puppy grooming appointments for **Puppy Spa**, replacing their physical logbook with a digital solution.

---

## 🐶 Overview

Puppy Spa operates as a walk-in-only service where puppy owners sign their puppies upon arrival and get serviced in the order they arrive. This application digitizes their current paper-based process, allowing for:

- **Easy puppy registration** - Record owner, breed, and puppy details
- **Daily waiting list management** - Create a new list each day
- **Flexible queue handling** - Reorder the waiting list when needed
- **Service tracking** - Mark puppies as serviced, cancelled, or completed
- **Appointment scheduling** - Book future appointments for specific times
- **Historical reporting** - View past waiting lists with status information
- **Search capabilities** - Find specific puppies across all records by name, owner, or breed
- **Pampered Pups Gallery** - Showcase beautifully groomed puppies
- **Statistics Dashboard** - View service metrics and trends
- **Automated status updates** - Scheduled appointments automatically move to waiting list

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first styling
- **Axios** - HTTP client for API requests
- **React Beautiful DnD** - Drag and drop functionality for reordering
- **React Hook Form** - Form validation and handling
- **React Icons** - Icon library

### Backend
- **NestJS 11** - TypeScript-based Node.js framework
- **PostgreSQL** - Relational database
- **Prisma 6** - Type-safe ORM
- **Jest** - Testing framework
- **RESTful API** - JSON-based communication

### Testing
- **Jest** - Unit and integration testing
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing
- **Supertest** - API testing

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Node.js** - Runtime for the frontend in development mode

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │     │                     │
│    Next.js App      │     │    NestJS API       │     │    PostgreSQL DB    │
│                     │     │                     │     │                     │
│  - React Components │     │  - Controllers      │     │  - WaitingList      │
│  - API Client       │◄───►│  - Services         │◄───►│  - Puppy            │
│  - Pages            │     │  - Modules          │     │  - WaitingListEntry │
│  - Styling          │     │  - Prisma Client    │     │                     │
│                     │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### Core Entities

- **Puppy**: Represents a puppy client with name and owner information
- **WaitingList**: Represents a daily waiting list (one per day)
- **WaitingListEntry**: Represents a puppy's entry on a specific waiting list with service details, position, and status

### Data Flow

1. Receptionist creates a daily waiting list (if not exists)
2. Puppies are added to the waiting list with service details
3. Entries can be reordered as needed
4. Entries are marked as serviced when completed
5. Historical data can be viewed and searched

---

## 🗄️ Database Schema (Prisma)

```prisma
model WaitingList {
  id        Int                  @id @default(autoincrement())
  date      DateTime             @unique
  createdAt DateTime             @default(now())
  entries   WaitingListEntry[]
}

model Puppy {
  id        Int                  @id @default(autoincrement())
  name      String
  ownerName String
  breed     String?
  notes     String?
  createdAt DateTime             @default(now())
  entries   WaitingListEntry[]
}

model WaitingListEntry {
  id              Int         @id @default(autoincrement())
  waitingListId   Int
  puppyId         Int
  serviceRequired String
  notes           String?
  arrivalTime     DateTime?   @default(now())
  serviceTime     DateTime?
  scheduledTime   DateTime?
  position        Int
  serviced        Boolean     @default(false)
  isFutureBooking Boolean     @default(false)
  status          String      @default("waiting")
  createdAt       DateTime    @default(now())

  waitingList     WaitingList @relation(fields: [waitingListId], references: [id])
  puppy           Puppy       @relation(fields: [puppyId], references: [id])

  @@index([waitingListId])
  @@index([puppyId])
}
```

See [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) for details.

---

## 📋 API Overview

### Puppy Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/puppy/create` | Create a new puppy |
| GET | `/puppy/search?q=query` | Search for puppies by name or owner |
| GET | `/puppy/all` | Get all puppies (for dropdown selection) |

### Waiting List Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/waiting-list/create-today` | Create today's waiting list |
| GET | `/waiting-list/today` | Get today's waiting list with entries |
| POST | `/waiting-list/add-entry` | Add a puppy to today's waiting list |
| PATCH | `/waiting-list/reorder` | Reorder entries in the waiting list |
| PATCH | `/waiting-list/mark-serviced/:entryId` | Mark an entry as serviced |
| PATCH | `/waiting-list/cancel/:entryId` | Mark an entry as cancelled |
| POST | `/waiting-list/update-past-appointments` | Update status of past appointments |
| GET | `/waiting-list/history/:date` | Get waiting list for a specific date |
| GET | `/waiting-list/all` | Get all waiting lists (for history view) |
| GET | `/waiting-list/search?q=query` | Search waiting list history |
| GET | `/waiting-list/statistics` | Get statistics about waiting lists and services |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git
- Docker and Docker Compose (for containerized setup)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/ayushkmr/spa-pup.git
cd spa-pup
```

2. **Start the application using Docker Compose**

```bash
# For development environment
docker-compose --env-file .env.docker up -d

# For production environment
docker-compose --env-file .env.production up -d
```

This will:
- Start a PostgreSQL database container
- Start a PGAdmin container for database management
- Pull or build the NestJS backend container
- Pull or build the Next.js frontend container
- Run database migrations automatically

3. **Access the application**

- Frontend: http://localhost:3000
  - Default admin login:
    - Username: admin
    - Password: admin123
- Backend API: http://localhost:3005
- PGAdmin (Database Management): http://localhost:5050
  - Email: admin@puppyspa.com
  - Password: admin

4. **View logs**

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
```

5. **Stop the application**

```bash
docker-compose down
```

6. **Build and push platform-agnostic Docker images**

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Build and push development images
./build-push-images.sh dev

# Build and push production images
./build-push-images.sh prod
```

7. **Use environment variables to configure the application**

You can customize the application behavior by modifying the environment files:
- `.env.docker` - Development environment configuration
- `.env.production` - Production environment configuration

Key environment variables:
- `NODE_ENV` - Set to `development` or `production`
- `NEXT_PUBLIC_API_URL` - API URL for frontend to backend communication
- `DATABASE_URL` - PostgreSQL connection string

### Option 2: Manual Setup

#### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/puppy-spa.git
cd puppy-spa
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Configure environment variables**

```bash
# Copy the example env file
cp .env.example .env

# Edit the .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/puppy_spa"
```

4. **Run database migrations**

```bash
npx prisma migrate dev --name init
```

5. **Start the backend server**

```bash
npm run start:dev
```

The backend will be available at http://localhost:3005

#### Frontend Setup

1. **Install frontend dependencies**

```bash
cd ../frontend
npm install --legacy-peer-deps
```

2. **Configure environment variables**

```bash
# Create a .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3005" > .env.local
```

3. **Start the frontend development server**

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

---

## 💻 Development Workflow

### Backend Development

1. **Create/modify Prisma models** in `backend/prisma/schema.prisma`
2. **Run migrations** with `npx prisma migrate dev --name your_change_name`
3. **Create/modify NestJS modules, controllers, services** in `backend/src`
4. **Test API endpoints** using tools like Postman or curl

### Frontend Development

1. **Create/modify React components** in `frontend/src/components`
2. **Create/modify pages** in `frontend/src/app`
3. **Add API client functions** in `frontend/src/api`
4. **Style components** using Tailwind CSS

### Testing

1. **Run backend unit tests**
   ```bash
   cd backend && npm test
   ```

2. **Run backend integration tests**
   ```bash
   cd backend && npm run test:integration
   ```

3. **Run frontend unit tests**
   ```bash
   cd frontend && npx jest
   ```

4. **Run frontend end-to-end tests**
   ```bash
   cd frontend && npm run cypress:headless
   ```

### Docker Development

1. **Modify Docker configuration** in `docker-compose.yml`, `backend/Dockerfile`, or `frontend/Dockerfile`
2. **Choose environment** by selecting the appropriate `.env` file:
   - `.env.docker` for development
   - `.env.production` for production
3. **Rebuild containers** with `docker-compose --env-file .env.docker build`
4. **Restart services** with `docker-compose --env-file .env.docker up -d`
5. **View logs** with `docker-compose logs`
6. **Build and push multi-platform images** with `./build-push-images.sh [dev|prod]`

### Cypress Testing
   ```bash
   cd frontend && npm run cypress
   ```

---

## 💡 Best Practices

- **Modular Architecture**: Separate concerns between frontend and backend
- **Type Safety**: Use TypeScript throughout the application
- **Database Access**: Use Prisma for type-safe database operations
- **API Design**: Follow RESTful principles
- **Error Handling**: Provide meaningful error messages
- **Validation**: Validate all inputs on both client and server
- **Comprehensive Testing**: Multiple layers of testing (unit, integration, E2E)
- **Documentation**: Keep code and API documentation up-to-date
- **Environment Variables**: Use for configuration
- **Code Formatting**: Consistent styling with ESLint and Prettier
- **Component-Based Design**: Reusable UI components
- **Responsive Design**: Mobile-friendly interface
- **Accessibility**: Ensure the application is usable by everyone
- **Performance Optimization**: Minimize loading times and optimize rendering

---

## 📅 User Stories & Tasks

See [TASKS.md](TASKS.md) for detailed user stories, acceptance criteria, and implementation tasks.

See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for detailed system design documentation.

---

## ✨ Implemented Features

### Core Features
- **Today's Queue Management**: Create and manage the daily waiting list
- **Puppy Registration**: Add new puppies with owner, breed, and notes information
- **Service Tracking**: Mark puppies as completed, cancelled, or waiting
- **Queue Reordering**: Drag and drop to reorder the waiting list
- **Tabbed Interface**: Easily switch between waiting, future, completed, and cancelled puppies
- **Search Functionality**: Find puppies by name, owner, breed, or service type
- **History View**: Access past waiting lists and entries with status information
- **Future Bookings**: Schedule appointments for future dates and times
- **Automated Status Updates**: Cron jobs to automatically update appointment statuses
- **Comprehensive Seed Data**: Sample data for testing and demonstration

### UI Enhancements
- **Pampered Pups Gallery**: Showcase beautifully groomed puppies at the bottom of the page
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Immediate feedback on form inputs
- **Loading States**: Visual indicators during data fetching
- **Error Handling**: User-friendly error messages

### Technical Improvements
- **PostgreSQL Migration**: Moved from MongoDB to PostgreSQL for better relational data handling
- **Comprehensive Testing**: Added unit, integration, and E2E tests
- **Type Safety**: Full TypeScript implementation
- **API Integration**: Robust API client with error handling
- **Containerization**: Docker and Docker Compose setup for easy deployment
- **Development Mode**: Next.js development server for hot reloading during development
- **Scheduled Tasks**: Cron jobs for automated status updates
- **Admin User**: Built-in admin user for administrative access
- **Enhanced Schema**: Improved database schema with optional fields and better relationships
- **Optimized Queries**: Efficient database queries for better performance

---

## 🔮 Future Enhancements

- **Enhanced Authentication**: Role-based staff login system
- **Notifications**: SMS/email alerts for waiting clients
- **Advanced Analytics**: More detailed business insights and reporting
- **Mobile App**: Native mobile experience
- **Customer Portal**: Allow customers to check wait times
- **Service Catalog**: Manage available services and pricing
- **Staff Management**: Track staff availability and assignments
- **Online Booking**: Allow customers to book appointments online
- **Payment Processing**: Integrate payment gateway for online payments
- **Loyalty Program**: Implement a loyalty program for regular customers