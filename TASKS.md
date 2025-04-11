# Puppy Spa Waiting List App - User Stories & Tasks

---

## 📝 User Stories

| User Story | Acceptance Criteria | Priority | Status |
| --- | --- | --- | --- |
| **As a Puppy Spa receptionist, I want to easily record a new puppy on the waiting list, so that I can have a sequenced list of puppies to be served** | - The process of entering puppies on the list must be as simple as writing it down on a piece of paper / word document / excel<br>- I should be able to record the name of the owner/puppy, breed, the service they require and their time of arrival | High | ✅ Completed |
| **As a Puppy Spa receptionist, I want to be able to create a new waiting list for each day, so that I can organize each day's clients** | - I should be able to easily generate a new waiting list each day by simply clicking a button<br>- Each day should only have one waiting list associated with it | High | ✅ Completed |
| **As a Puppy Spa receptionist, I want to be able to see waiting lists from previous days, so that I can report our performance to the accountant** | - I should be able to see a full list of waiting list entries by day | Medium | ✅ Completed |
| **As a Puppy Spa receptionist, I want to be able to re-order the waiting list, so that it can reflect the real waiting list** | - I should be able to bump people up or down the waiting list | High | ✅ Completed |
| **As a Puppy Spa receptionist, I want to be able to mark clients that have been serviced off of the waiting list, so that I can only focus on clients that are still to be serviced** | - The process of marking a client as serviced must be as easy as ticking a check-box | High | ✅ Completed |
| **As a Puppy Spa receptionist, I want to be able to search the entire history of waiting list logs to find records related to a specific puppy, so that I can have a view of our service history to the puppy** | - The ability to search should allow for partial entry of the puppy's details | Low | ✅ Completed |
| **As a Puppy Spa receptionist, I want to be able to schedule future appointments for puppies, so that I can manage the spa's workload in advance** | - I should be able to book appointments for future dates and times<br>- Future appointments should automatically appear in the waiting list on the scheduled day | Medium | ✅ Completed |
| **As a Puppy Spa receptionist, I want to be able to cancel appointments, so that I can manage no-shows and cancellations** | - I should be able to mark an appointment as cancelled<br>- Cancelled appointments should be visually distinct from completed ones | Medium | ✅ Completed |
| **As a Puppy Spa receptionist, I want to record breed information for puppies, so that I can better track our client base** | - I should be able to select or enter a breed when creating a puppy<br>- Breed information should be displayed in the waiting list and history | Medium | ✅ Completed |
| **As a Puppy Spa manager, I want past waiting appointments to be automatically cancelled at the end of the day, so that the system stays organized** | - Waiting appointments should automatically move to cancelled status when the day completes<br>- This should happen without manual intervention | Low | ✅ Completed |

---

## ✅ Implementation Tasks

### Backend Tasks

#### Setup and Configuration
- [x] Setup PostgreSQL database and user
- [x] Initialize NestJS backend with Prisma ORM
- [x] Define Prisma schema and run migrations
- [x] Configure backend to run on port 3005
- [x] Enable CORS for frontend communication
- [x] Create .env.example file with required environment variables
- [x] Add validation pipes for request data
- [x] Set up Docker configuration for backend

#### API Implementation
- [x] Scaffold NestJS modules, services, controllers
- [x] Implement Puppy API (create, search)
  - [x] POST /puppy/create - Create a new puppy with breed information
  - [x] GET /puppy/search - Search for puppies by name, owner, or breed
  - [x] GET /puppy/all - Get all puppies for dropdown selection
- [x] Implement Waiting List API
  - [x] POST /waiting-list/create-today - Create today's list
  - [x] POST /waiting-list/add-entry - Add puppy to today's list with optional scheduling
  - [x] GET /waiting-list/today - Get today's list with entries
  - [x] PATCH /waiting-list/reorder - Reorder entries
  - [x] PATCH /waiting-list/mark-serviced/:entryId - Mark entry as completed
  - [x] PATCH /waiting-list/cancel/:entryId - Mark entry as cancelled
  - [x] POST /waiting-list/update-past-appointments - Update status of past appointments
  - [x] GET /waiting-list/history/:date - Get list by date
  - [x] GET /waiting-list/all - Get all waiting lists for history view
  - [x] GET /waiting-list/search - Search waiting list history
  - [x] GET /waiting-list/statistics - Get statistics for date range

#### Testing and Documentation
- [x] Write unit tests for services
- [x] Write integration tests for controllers
- [x] Write e2e tests for API endpoints
- [x] Document architecture in README.md
- [x] Document API endpoints

### Frontend Tasks

#### Setup and Configuration
- [x] Initialize Next.js frontend
- [x] Configure Tailwind CSS with custom theme
- [x] Create responsive layout with navigation
- [x] Set up API client for backend communication
- [x] Configure environment variables
- [x] Set up Docker configuration for frontend

#### UI Components
- [x] Create layout component with navigation
- [x] Create tabbed waiting list component
  - [x] Display puppies in order
  - [x] Show service details and breed information
  - [x] Add status management (completed, cancelled, waiting)
  - [x] Implement drag-and-drop reordering
  - [x] Separate tabs for waiting, future, completed, and cancelled
- [x] Create add entry form component
  - [x] Puppy selection/creation
  - [x] Service selection
  - [x] Scheduling options for future appointments
  - [x] Notes field
  - [x] Form validation
- [x] Create puppy form component
  - [x] Name and owner fields
  - [x] Breed selection dropdown
  - [x] Notes field
  - [x] Form validation
- [x] Create history view component
  - [x] Date selection
  - [x] List display
- [x] Create search component
  - [x] Search input
  - [x] Results display
- [x] Create puppy gallery component with images

#### Pages
- [x] Create home page with today's waiting list
- [x] Create add puppy page
- [x] Create add entry to waiting list page
- [x] Create history page with date selection
- [x] Create search page
- [x] Create statistics page with charts

#### State Management and Data Fetching
- [x] Implement API hooks for data fetching
- [x] Set up error handling and loading states
- [x] Implement optimistic UI updates
- [x] Add real-time updates (optional)

#### Testing and Polishing
- [x] Write unit tests for components
- [x] Write integration tests for pages
- [x] Ensure responsive design works on all devices
- [x] Add accessibility features
- [x] Polish UI/UX with animations and transitions

### Deployment

- [x] Set up database for production
- [x] Configure environment variables for production
- [x] Deploy backend to cloud provider (Azure VM with Docker)
- [x] Deploy frontend to cloud provider (Azure VM with Docker)
- [x] Set up monitoring and logging
- [x] Configure CI/CD pipeline (optional)

---

## 💡 Notes

- Focus on **simplicity** and **ease of use** for receptionists
- Prioritize **core flows**: add puppy, create daily list, reorder, mark serviced
- Search and history are **nice-to-have** features
- Use environment variables for config
- Modular, maintainable codebase
- Ensure good error handling and user feedback
- Consider accessibility from the start
- Implement progressive enhancement where possible

## 📊 Progress Tracking

| Feature | Backend | Frontend | Testing | Status |
| --- | --- | --- | --- | --- |
| Create waiting list | ✅ | ✅ | ✅ | Completed |
| Add puppy to list | ✅ | ✅ | ✅ | Completed |
| View today's list | ✅ | ✅ | ✅ | Completed |
| Reorder entries | ✅ | ✅ | ✅ | Completed |
| Mark as completed | ✅ | ✅ | ✅ | Completed |
| Mark as cancelled | ✅ | ✅ | ✅ | Completed |
| View history | ✅ | ✅ | ✅ | Completed |
| Search functionality | ✅ | ✅ | ✅ | Completed |
| Statistics | ✅ | ✅ | ✅ | Completed |
| Puppy Gallery | ✅ | ✅ | ✅ | Completed |
| Breed information | ✅ | ✅ | ✅ | Completed |
| Future appointments | ✅ | ✅ | ✅ | Completed |
| Automated status updates | ✅ | ✅ | ✅ | Completed |
| Admin user | ✅ | ✅ | ✅ | Completed |
| Deployment | ✅ | ✅ | ✅ | Completed |

## 🚀 Future Enhancements

### User Experience Improvements
- [ ] Add dark mode support
- [ ] Implement keyboard shortcuts for common actions
- [ ] Add notifications for new puppies added to the queue
- [ ] Implement multi-language support
- [ ] Add print functionality for daily reports

### Feature Enhancements
- [ ] Enhance user authentication with role-based access control
- [ ] Expand appointment scheduling with recurring appointments
- [ ] Add customer profiles with contact information and preferences
- [ ] Create a customer-facing portal for appointment booking
- [ ] Implement SMS/email notifications for customers
- [ ] Add inventory management for spa supplies
- [ ] Implement a loyalty program for regular customers

### Technical Improvements
- [ ] Implement real-time updates using WebSockets
- [ ] Enhance logging and monitoring
- [ ] Implement automated backups for the database
- [ ] Set up CI/CD pipeline for automated testing and deployment
- [ ] Further optimize database queries for better performance
- [ ] Implement caching for frequently accessed data
- [ ] Add offline support with service workers
- [ ] Implement GraphQL API for more efficient data fetching

### Mobile Experience
- [ ] Create a dedicated mobile app using React Native
- [ ] Add barcode/QR code scanning for quick puppy check-in
- [ ] Implement push notifications for mobile users
- [ ] Add photo capture functionality for before/after pictures

### Analytics and Reporting
- [ ] Enhance statistics with more detailed analytics
- [ ] Create customizable reports for business insights
- [ ] Implement revenue tracking and financial reporting
- [ ] Add customer retention and loyalty analytics
- [ ] Create heatmaps for busy hours and service popularity
