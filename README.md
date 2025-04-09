# Puppy Spa Waiting List App

A full-stack web application to manage daily puppy grooming appointments for **Puppy Spa**, replacing their physical logbook with a digital solution.

---

## 🐶 Overview

Puppy Spa operates as a walk-in-only service where puppy owners sign their puppies upon arrival and get serviced in the order they arrive. This application digitizes their current paper-based process, allowing for:

- **Easy puppy registration** - Record owner and puppy details
- **Daily waiting list management** - Create a new list each day
- **Flexible queue handling** - Reorder the waiting list when needed
- **Service tracking** - Mark puppies as serviced
- **Historical reporting** - View past waiting lists
- **Search capabilities** - Find specific puppies across all records

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first styling
- **React Query** (planned) - Data fetching and caching
- **React DnD** (planned) - Drag and drop functionality

### Backend
- **NestJS 11** - TypeScript-based Node.js framework
- **PostgreSQL** - Relational database
- **Prisma 6** - Type-safe ORM
- **Jest** - Testing framework
- **RESTful API** - JSON-based communication

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
  createdAt DateTime             @default(now())
  entries   WaitingListEntry[]
}

model WaitingListEntry {
  id              Int         @id @default(autoincrement())
  waitingListId   Int
  puppyId         Int
  serviceRequired String
  arrivalTime     DateTime    @default(now())
  position        Int
  serviced        Boolean     @default(false)
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
| GET | `/waiting-list/history/:date` | Get waiting list for a specific date |
| GET | `/waiting-list/all` | Get all waiting lists (for history view) |
| GET | `/waiting-list/search?q=query` | Search waiting list history |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### Backend Setup

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

The backend will be available at http://localhost:3001

### Frontend Setup

1. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

2. **Configure environment variables**

```bash
# Create a .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
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

1. **Run backend tests** with `cd backend && npm test`
2. **Run frontend tests** with `cd frontend && npm test`

---

## 💡 Best Practices

- **Modular Architecture**: Separate concerns between frontend and backend
- **Type Safety**: Use TypeScript throughout the application
- **Database Access**: Use Prisma for type-safe database operations
- **API Design**: Follow RESTful principles
- **Error Handling**: Provide meaningful error messages
- **Validation**: Validate all inputs on both client and server
- **Testing**: Write tests for critical functionality
- **Documentation**: Keep code and API documentation up-to-date
- **Environment Variables**: Use for configuration
- **Code Formatting**: Consistent styling with ESLint and Prettier

---

## 📅 User Stories & Tasks

See [TASKS.md](TASKS.md) for detailed user stories, acceptance criteria, and implementation tasks.

See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for detailed system design documentation.

---

## 🔮 Future Enhancements

- **Authentication**: Staff login system
- **Notifications**: SMS/email alerts for waiting clients
- **Analytics Dashboard**: Business insights and reporting
- **Mobile App**: Native mobile experience
- **Appointment Scheduling**: Add appointment booking capability
- **Customer Portal**: Allow customers to check wait times
- **Service Catalog**: Manage available services and pricing
- **Staff Management**: Track staff availability and assignments