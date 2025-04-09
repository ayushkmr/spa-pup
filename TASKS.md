# Puppy Spa Waiting List App - User Stories & Tasks

---

## 📝 User Stories

| User Story | Acceptance Criteria | Priority |
| --- | --- | --- |
| **As a Puppy Spa receptionist, I want to easily record a new puppy on the waiting list, so that I can have a sequenced list of puppies to be served** | - The process of entering puppies on the list must be as simple as writing it down on a piece of paper / word document / excel<br>- I should be able to record the name of the owner/puppy, the service they require and their time of arrival | High |
| **As a Puppy Spa receptionist, I want to be able to create a new waiting list for each day, so that I can organize each day's clients** | - I should be able to easily generate a new waiting list each day by simply clicking a button<br>- Each day should only have one waiting list associated with it | High |
| **As a Puppy Spa receptionist, I want to be able to see waiting lists from previous days, so that I can report our performance to the accountant** | - I should be able to see a full list of waiting list entries by day | Medium |
| **As a Puppy Spa receptionist, I want to be able to re-order the waiting list, so that it can reflect the real waiting list** | - I should be able to bump people up or down the waiting list | High |
| **As a Puppy Spa receptionist, I want to be able to mark clients that have been serviced off of the waiting list, so that I can only focus on clients that are still to be serviced** | - The process of marking a client as serviced must be as easy as ticking a check-box | High |
| **As a Puppy Spa receptionist, I want to be able to search the entire history of waiting list logs to find records related to a specific puppy, so that I can have a view of our service history to the puppy** | - The ability to search should allow for partial entry of the puppy's details | Low |

---

## ✅ Implementation Tasks

### Backend Tasks

#### Setup and Configuration
- [x] Setup PostgreSQL database and user
- [x] Initialize NestJS backend with Prisma ORM
- [x] Define Prisma schema and run migrations
- [x] Configure backend to run on port 3001
- [x] Enable CORS for frontend communication
- [x] Create .env.example file with required environment variables
- [ ] Add validation pipes for request data

#### API Implementation
- [x] Scaffold NestJS modules, services, controllers
- [x] Implement Puppy API (create, search)
  - [x] POST /puppy/create - Create a new puppy
  - [x] GET /puppy/search - Search for puppies
  - [ ] GET /puppy/all - Get all puppies for dropdown selection
- [x] Implement Waiting List API
  - [x] POST /waiting-list/create-today - Create today's list
  - [x] POST /waiting-list/add-entry - Add puppy to today's list
  - [x] GET /waiting-list/today - Get today's list with entries
  - [x] PATCH /waiting-list/reorder - Reorder entries
  - [x] PATCH /waiting-list/mark-serviced/:entryId - Mark entry as serviced
  - [x] GET /waiting-list/history/:date - Get list by date
  - [ ] GET /waiting-list/all - Get all waiting lists for history view
  - [ ] GET /waiting-list/search - Search waiting list history

#### Testing and Documentation
- [ ] Write unit tests for services
- [ ] Write integration tests for controllers
- [ ] Write e2e tests for API endpoints
- [x] Document architecture in README.md
- [x] Document API endpoints

### Frontend Tasks

#### Setup and Configuration
- [x] Initialize Next.js frontend
- [ ] Configure Tailwind CSS with custom theme
- [ ] Create responsive layout with navigation
- [ ] Set up API client for backend communication
- [ ] Configure environment variables

#### UI Components
- [ ] Create layout component with navigation
- [ ] Create waiting list table component
  - [ ] Display puppies in order
  - [ ] Show service details
  - [ ] Add serviced checkbox
  - [ ] Implement drag-and-drop reordering
- [ ] Create add entry form component
  - [ ] Puppy selection/creation
  - [ ] Service selection
  - [ ] Form validation
- [ ] Create puppy form component
  - [ ] Name and owner fields
  - [ ] Form validation
- [ ] Create history view component
  - [ ] Date selection
  - [ ] List display
- [ ] Create search component
  - [ ] Search input
  - [ ] Results display

#### Pages
- [ ] Create home page with today's waiting list
- [ ] Create add puppy page
- [ ] Create add entry to waiting list page
- [ ] Create history page with date selection
- [ ] Create search page

#### State Management and Data Fetching
- [ ] Implement API hooks for data fetching
- [ ] Set up error handling and loading states
- [ ] Implement optimistic UI updates
- [ ] Add real-time updates (optional)

#### Testing and Polishing
- [ ] Write unit tests for components
- [ ] Write integration tests for pages
- [ ] Ensure responsive design works on all devices
- [ ] Add accessibility features
- [ ] Polish UI/UX with animations and transitions

### Deployment

- [ ] Set up database for production
- [ ] Configure environment variables for production
- [ ] Deploy backend to cloud provider
- [ ] Deploy frontend to Vercel or similar
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline (optional)

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
| Create waiting list | ✅ | ❌ | ❌ | In Progress |
| Add puppy to list | ✅ | ❌ | ❌ | In Progress |
| View today's list | ✅ | ❌ | ❌ | In Progress |
| Reorder entries | ✅ | ❌ | ❌ | In Progress |
| Mark as serviced | ✅ | ❌ | ❌ | In Progress |
| View history | ✅ | ❌ | ❌ | In Progress |
| Search functionality | ❌ | ❌ | ❌ | Not Started |
