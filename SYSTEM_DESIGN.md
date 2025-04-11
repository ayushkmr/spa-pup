# Puppy Spa - System Design

## Overview

Puppy Spa is a waiting list management application designed to help a local puppy grooming store manage their daily client list. The application replaces a physical logbook with a digital platform, making it easier to track puppies waiting for service, mark them as serviced, and maintain historical records.

## Business Requirements

### Current Process

Puppy Spa currently operates as follows:

1. Puppy owners arrive at the spa and sign in on a physical logbook
2. Each day has a dedicated page in the logbook
3. The receptionist records puppy/owner details and the service required
4. Puppies are generally served in the order they arrive
5. Sometimes the order needs to change if clients miss their turn or leave
6. The receptionist calls out the next client based on the logbook
7. The logbook serves as a historical record for accounting purposes

### Pain Points

1. Physical logbook is difficult to manage and maintain over time
2. Reordering the waiting list requires crossing out and rewriting entries
3. Marking clients as serviced is not standardized
4. Searching historical records is time-consuming
5. Reporting on past performance is manual and error-prone

### Key Requirements

1. Simple, intuitive interface that mimics the simplicity of a paper logbook
2. Ability to create a new waiting list each day
3. Easy recording of puppy/owner details and service requirements
4. Flexible reordering of the waiting list
5. Clear marking of serviced clients
6. Historical record viewing and searching

## Architecture

The application follows a modern full-stack architecture:

```
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │      │                     │
│   Frontend Layer    │      │   Backend Layer     │      │   Database Layer    │
│                     │      │                     │      │                     │
│   - Next.js         │      │   - NestJS          │      │   - PostgreSQL      │
│   - React           │ <──> │   - REST API        │ <──> │   - Prisma ORM      │
│   - TypeScript      │      │   - TypeScript      │      │   - Migrations      │
│   - Tailwind CSS    │      │   - Validation      │      │   - Relationships   │
│                     │      │                     │      │                     │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

### Frontend (Next.js)
- Modern React framework with server-side rendering capabilities
- App Router for file-based routing
- Tailwind CSS for utility-first styling
- React hooks for state management
- API client for communication with the backend
- TypeScript for type safety
- Responsive design for all device sizes

### Backend (NestJS)
- TypeScript-based Node.js framework
- Modular architecture with dependency injection
- RESTful API endpoints with proper HTTP methods
- Prisma ORM for database access
- Business logic implementation in services
- Validation using class-validator
- Error handling and logging

### Database (PostgreSQL)
- Relational database for storing waiting lists, puppies, and entries
- Managed through Prisma schema and migrations
- Indexes for performance optimization
- Relationships between entities
- Constraints for data integrity

## Data Model

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   WaitingList   │       │ WaitingListEntry │       │      Puppy      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │       │ id              │
│ date            │ 1───* │ waitingListId   │ *───1 │ name            │
│ createdAt       │       │ puppyId         │       │ ownerName       │
└─────────────────┘       │ serviceRequired │       │ breed           │
                          │ notes           │       │ notes           │
                          │ arrivalTime     │       │ createdAt       │
                          │ serviceTime     │       └─────────────────┘
                          │ scheduledTime   │
                          │ position        │
                          │ serviced        │
                          │ isFutureBooking │
                          │ status          │
                          │ createdAt       │
                          └─────────────────┘
```

### Entity Descriptions

1. **WaitingList**
   - Represents a daily waiting list
   - Has a unique date (one list per day)
   - Contains multiple entries (one-to-many relationship with WaitingListEntry)
   - Attributes:
     - `id`: Unique identifier
     - `date`: Date of the waiting list (unique)
     - `createdAt`: Timestamp of creation

2. **Puppy**
   - Represents a puppy client
   - Has name, owner, and breed information
   - Can include optional notes about the puppy
   - Can be associated with multiple waiting list entries over time
   - Attributes:
     - `id`: Unique identifier
     - `name`: Puppy's name
     - `ownerName`: Owner's name
     - `breed`: Puppy's breed (optional)
     - `notes`: Additional information about the puppy (optional)
     - `createdAt`: Timestamp of creation

3. **WaitingListEntry**
   - Represents a puppy's entry on a specific waiting list
   - Contains service details, notes, and status information
   - Has a position for ordering
   - Can be marked as completed, cancelled, or waiting
   - Supports future bookings with scheduled times
   - Attributes:
     - `id`: Unique identifier
     - `waitingListId`: Foreign key to WaitingList
     - `puppyId`: Foreign key to Puppy
     - `serviceRequired`: Description of the service
     - `notes`: Additional information about the service (optional)
     - `arrivalTime`: Time of arrival (optional for future bookings)
     - `serviceTime`: Time when the service was completed (optional)
     - `scheduledTime`: Scheduled time for future bookings (optional)
     - `position`: Order in the waiting list
     - `serviced`: Boolean indicating if serviced (legacy field)
     - `isFutureBooking`: Boolean indicating if this is a future booking
     - `status`: Current status (waiting, completed, cancelled)
     - `createdAt`: Timestamp of creation

## API Endpoints

### Waiting List Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/waiting-list/create-today` | Create today's waiting list | None | Created WaitingList |
| GET | `/waiting-list/today` | Get today's waiting list with entries | None | WaitingList with entries and puppies |
| POST | `/waiting-list/add-entry` | Add a puppy to today's waiting list | `{ puppyId, serviceRequired, notes?, arrivalTime?, scheduledTime?, isFutureBooking? }` | Created WaitingListEntry |
| PATCH | `/waiting-list/reorder` | Reorder entries in the waiting list | `{ entryOrder: number[] }` | Updated entries |
| PATCH | `/waiting-list/mark-serviced/:entryId` | Mark an entry as completed | None | Updated entry |
| PATCH | `/waiting-list/cancel/:entryId` | Mark an entry as cancelled | None | Updated entry |
| POST | `/waiting-list/update-past-appointments` | Update status of past appointments | None | Count of updated entries |
| GET | `/waiting-list/history/:date` | Get waiting list for a specific date | None | WaitingList with entries and puppies |
| GET | `/waiting-list/all` | Get all waiting lists (for history view) | None | Array of WaitingLists |
| GET | `/waiting-list/search?q=query` | Search waiting list history | Query param | Matching entries across lists |
| GET | `/waiting-list/statistics` | Get statistics for date range | Query params | Statistics data |

### Puppy Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/puppy/create` | Create a new puppy | `{ name, ownerName, breed?, notes? }` | Created Puppy |
| GET | `/puppy/search?q=query` | Search for puppies by name, owner, or breed | Query param | Matching puppies |
| GET | `/puppy/all` | Get all puppies | None | Array of Puppies |

## User Interface

The application will have the following main pages:

1. **Today's Waiting List**
   - View and manage today's waiting list
   - Add new entries
   - Reorder entries using drag and drop
   - Mark entries as completed or cancelled
   - Visual distinction between completed, cancelled, waiting, and scheduled puppies
   - Tabbed interface to switch between waiting, future, completed, and cancelled
   - Button to create today's list if it doesn't exist
   - Automatic handling of scheduled appointments

2. **Add Puppy**
   - Register a new puppy with name, owner, and breed details
   - Optional notes field for additional information
   - Form validation for required fields
   - Success confirmation and redirect

3. **Add to Waiting List**
   - Search for existing puppies by name, owner, or breed
   - Select a puppy from search results
   - Enter service required and optional notes
   - Option to schedule for a future date and time
   - Option to create a new puppy if not found

4. **History View**
   - Calendar or date picker to select a date
   - View waiting list for the selected date
   - Display statistics (total puppies, services completed, cancelled)
   - Show breed information for each puppy
   - Visual distinction between completed, cancelled, and waiting entries
   - Option to export data (future enhancement)

5. **Search**
   - Search input for puppy name, owner name, or breed
   - Display results across all waiting lists
   - Show status information for each entry
   - Filter options by date range and status (future enhancement)

## Component Structure

```
├── Layout
│   ├── Header
│   ├── Navigation
│   ├── Footer
│   └── Page Container
│
├── Waiting List
│   ├── TabbedWaitingList
│   ├── WaitingListEntry
│   ├── CreateListButton
│   ├── AddEntryButton
│   ├── StatusControls
│   └── AppointmentScheduler
│
├── Puppy
│   ├── PuppyForm
│   ├── BreedSelector
│   ├── PuppySearch
│   └── PuppyCard
│
├── History
│   ├── DatePicker
│   ├── HistoryList
│   └── HistoryStats
│
└── Search
    ├── SearchInput
    ├── SearchResults
    └── SearchFilters
```

## Design Decisions

### Technology Choices

1. **Next.js for Frontend**
   - Provides server-side rendering for better SEO and performance
   - Built-in routing and API routes
   - Strong TypeScript support
   - Modern React features (hooks, suspense, etc.)
   - Fast refresh for development
   - Growing ecosystem and community

2. **NestJS for Backend**
   - Structured, modular architecture inspired by Angular
   - Dependency injection for better testability and maintainability
   - Strong TypeScript support with decorators
   - Comprehensive documentation and active community
   - Built-in support for validation, error handling, and logging
   - Scalable architecture for future growth

3. **PostgreSQL with Prisma**
   - Relational database for structured data with relationships
   - Prisma provides type-safe database access with generated types
   - Schema migrations for version control and team collaboration
   - Efficient querying capabilities with automatic joins
   - Transaction support for data integrity
   - Strong ecosystem and tooling

4. **Tailwind CSS**
   - Utility-first approach for rapid UI development
   - Consistent design system
   - Responsive design out of the box
   - Minimal CSS footprint with purging
   - Customizable theme

### Architectural Decisions

1. **Separation of Concerns**
   - Clear separation between frontend and backend
   - Backend divided into modules (waiting list, puppy)
   - Services handle business logic, controllers handle HTTP requests
   - Repository pattern via Prisma for data access
   - Frontend components organized by feature

2. **RESTful API Design**
   - Consistent endpoint naming following REST conventions
   - Appropriate HTTP methods for different operations (GET, POST, PATCH)
   - Structured response formats with proper status codes
   - Query parameters for filtering and searching
   - Versioning strategy for future API changes

3. **Data Modeling**
   - Normalized database schema to minimize redundancy
   - Explicit relationships between entities
   - Indexes for frequently queried fields
   - Timestamps for auditing
   - Soft deletion consideration for future

4. **State Management**
   - React Query for server state management
   - Local state with React hooks for UI state
   - Optimistic updates for better UX
   - Proper error handling and loading states

5. **Performance Considerations**
   - Pagination for large datasets
   - Efficient database queries with proper indexes
   - Caching strategies for frequently accessed data
   - Lazy loading of components and data

## Security Considerations

1. **Input Validation**
   - Validate all inputs on both client and server
   - Use class-validator for backend validation
   - Sanitize inputs to prevent XSS attacks

2. **API Security**
   - CORS configuration to restrict access
   - Rate limiting for API endpoints
   - Input validation and sanitization
   - Proper error handling without exposing sensitive information

3. **Database Security**
   - Use environment variables for database credentials
   - Least privilege principle for database access
   - Parameterized queries via Prisma to prevent SQL injection

4. **Future Authentication**
   - JWT-based authentication
   - Role-based access control
   - Secure password storage with hashing

## Deployment Considerations

1. **Environment Configuration**
   - Use environment variables for configuration
   - Different configurations for development, testing, and production
   - Secrets management

2. **Deployment Options**
   - Frontend: Vercel, Netlify, or similar platforms
   - Backend: Heroku, AWS, Digital Ocean, or similar
   - Database: Managed PostgreSQL service (AWS RDS, Digital Ocean)

3. **CI/CD Pipeline**
   - Automated testing before deployment
   - Continuous integration with GitHub Actions
   - Automated deployment on successful builds

4. **Monitoring and Logging**
   - Application logging
   - Error tracking
   - Performance monitoring
   - Database monitoring

## Future Enhancements

1. **Enhanced Authentication and Authorization**
   - Role-based access control with different permission levels
   - Multi-factor authentication for admin users
   - Comprehensive audit logging

2. **Advanced Features**
   - Notifications for waiting clients (SMS/email)
   - Estimated wait time calculation based on historical data
   - More detailed service time tracking
   - Customer feedback collection and rating system
   - Recurring appointment scheduling

3. **Reporting and Analytics**
   - Enhanced business insights dashboard
   - More detailed service popularity reports
   - Wait time analytics by breed and service type
   - Staff performance metrics and workload balancing
   - Revenue forecasting

4. **Integration Possibilities**
   - Payment processing and invoicing
   - Customer loyalty program with points and rewards
   - Inventory management for grooming supplies
   - Integration with accounting software
   - Online booking portal for customers

5. **Mobile Experience**
   - Progressive Web App (PWA) with offline capabilities
   - Native mobile application for staff and customers
   - Push notifications for appointment reminders
   - Photo capture and sharing of before/after grooming results

## Implementation Roadmap

### Phase 1: Core Functionality (Completed)
- Backend API for waiting list and puppy management
- Basic frontend for today's waiting list
- Add puppy and add to waiting list functionality
- Mark as serviced functionality

### Phase 2: Enhanced Features (Completed)
- History view with date selection
- Search functionality
- Drag and drop reordering
- Improved UI/UX

### Phase 3: Advanced Features (Completed)
- Appointment status management (completed, cancelled, waiting)
- Breed information tracking
- Future appointment scheduling
- Automated status updates via cron jobs
- Admin user management

### Phase 4: Polish and Optimization (Completed)
- Responsive design for all devices
- Performance optimizations
- Comprehensive testing
- Documentation
- Seed scripts for demonstration data

### Phase 5: Future Enhancements (Planned)
- Enhanced authentication system with roles
- Advanced reporting and analytics
- Customer notifications
- Online booking portal
- Mobile applications
