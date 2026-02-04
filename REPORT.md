# Project Report — Bus Booking

## Executive Summary
Bus Booking is a full-stack prototype for searching, selecting, and booking bus seats. The project combines a static frontend (HTML/CSS/Bootstrap and vanilla JavaScript) with a lightweight Node.js/Express backend. Data is persisted in local JSON files to keep the system simple and easy to run without external services. Users can search buses, select seats, provide passenger details, and confirm payment to complete a booking.

This report provides a complete technical and functional explanation of the project, including architecture, page-by-page behavior, API details, data flows, storage model, and recommendations.

## Goals and Scope
### Goals
- Provide a simple, intuitive bus booking experience.
- Support end-to-end flow: search → select seats → passenger details → payment → confirmation.
- Demonstrate backend APIs for authentication, bus search, and booking.
- Keep the system easy to run locally without additional services.

### Scope
Included:
- Basic authentication (signup/login).
- Bus search by origin, destination, and date.
- Seat availability checking.
- Booking creation and simulated payment confirmation.
- UI pages for each stage of the flow.

Not included:
- Real payment gateway integration.
- Robust authorization or roles.
- Production database or multi-user concurrency controls.
- Advanced seat management or dynamic bus schedules.

## Tech Stack
### Frontend
- HTML5 and Bootstrap 5 for layout and components.
- Custom CSS for theme and visuals.
- Vanilla JavaScript for state management and API calls.

### Backend
- Node.js + Express.
- CORS and body-parser for HTTP handling.
- bcrypt for password hashing.
- jsonwebtoken for issuing auth tokens.

### Storage
- JSON files in backend/data for users, buses, and bookings.

## High-Level Architecture
### Components
- Static pages served as files (no build step).
- Single JavaScript file (assests/js/main.js) controls the UI, navigation, and API calls.
- Express server exposes REST-like endpoints.
- JSON file storage via a small database utility (backend/utils/database.js).

### Key Files and Responsibilities
- [index.html](index.html): Home page with bus search form.
- [bus_list.html](bus_list.html): Shows search results.
- [seat_selection.html](seat_selection.html): Seat layout and selection.
- [passenger_details.html](passenger_details.html): Collect passenger info.
- [payment.html](payment.html): Payment step (simulated).
- [payment_success.html](payment_success.html): Payment success screen.
- [confirmation.html](confirmation.html): Final booking confirmation.
- [login.html](login.html), [signup.html](signup.html): Auth pages.
- [about_us.html](about_us.html): Informational page.
- [assests/js/main.js](assests/js/main.js): Frontend logic.
- [assests/css/styles.css](assests/css/styles.css): UI styling.
- [backend/server.js](backend/server.js): Express server entry.
- [backend/routes](backend/routes): API routes.
- [backend/utils/database.js](backend/utils/database.js): JSON storage utility.

## Detailed User Experience (Page-by-Page)
### 1) Home Page (index.html)
Purpose: Start a bus search.

Key UI:
- Search form with From, To, and Date fields.
- Hero section to introduce the service.

Behavior:
- On submit, the form calls the backend search endpoint.
- Results are stored in localStorage under searchResults.
- The user is redirected to bus_list.html.

### 2) Bus List (bus_list.html)
Purpose: Show available buses for the search criteria.

Key UI:
- List of buses with name, type, timing, and price.
- “Select Seats” button on each bus.

Behavior:
- Reads searchResults from localStorage.
- Selecting a bus saves selectedBus and navigates to seat_selection.html.

### 3) Seat Selection (seat_selection.html)
Purpose: Choose seats based on availability.

Key UI:
- Seat layout (sleeper or seater layout based on bus type).
- Color-coded legend (available, selected, booked).
- “Proceed” button with total price.

Behavior:
- Fetches booked seats for the bus and date using the backend.
- Renders seat layout and locks already-booked seats.
- Selected seats are stored in localStorage.

### 4) Passenger Details (passenger_details.html)
Purpose: Capture passenger information for each selected seat.

Key UI:
- Form entries generated dynamically per seat.

Behavior:
- Requires the user to be logged in.
- On submit, sends booking creation request to backend.
- On success, stores booking as currentBooking and redirects to payment.html.

### 5) Payment (payment.html)
Purpose: Simulate payment.

Behavior:
- Calls the payment confirmation endpoint.
- On success, updates booking and navigates to payment_success.html.

### 6) Payment Success (payment_success.html)
Purpose: Confirm that payment was accepted.

Behavior:
- Lets user proceed to confirmation screen.

### 7) Confirmation (confirmation.html)
Purpose: Show booking summary.

Key UI:
- Booking ID, bus details, route, seats, passengers, and status.

Behavior:
- Reads currentBooking from localStorage.
- Displays all details in a structured summary.

### 8) Login / Signup
Purpose: Allow account creation and login.

Behavior:
- Signup sends user data to backend and stores returned token and user info.
- Login sends credentials, stores token and user info, then returns to home.

## Frontend Architecture and Logic
### State Management
The frontend uses browser storage:
- localStorage: currentUser, authToken, selectedBus, selectedSeats, currentBooking, searchResults.
- sessionStorage: search criteria.

### Core Logic in main.js
Key responsibilities:
- Navbar user display and logout.
- Search form handling.
- Bus list rendering.
- Seat selection and UI rendering.
- Booking creation and payment confirmation.
- Login/signup form handling.

### Data Flow Example (Search)
1) User fills search form.
2) main.js sends POST request to /api/buses/search.
3) Response is stored in localStorage.
4) User is redirected to bus_list.html.

## Backend Architecture
### Server
Express server in [backend/server.js](backend/server.js).

Responsibilities:
- Configure CORS and JSON parsing.
- Mount routes for auth, buses, and bookings.
- Provide a root health route.

### Routes
#### Auth (backend/routes/auth.js)
- POST /api/auth/signup
  - Creates a new user with bcrypt-hashed password.
  - Returns a JWT token and basic user info.
- POST /api/auth/login
  - Validates credentials.
  - Returns a JWT token and basic user info.

#### Buses (backend/routes/buses.js)
- POST /api/buses/search
  - Filters buses by from, to, and date.
  - Returns an array of buses.
- GET /api/buses/:id
  - Returns single bus details.
- GET /api/buses/:id/seats?date=YYYY-MM-DD
  - Returns booked seats for the bus and date.

#### Bookings (backend/routes/bookings.js)
- POST /api/bookings/create
  - Verifies bus exists.
  - Ensures requested seats are available.
  - Creates booking with status “confirmed”.
- POST /api/bookings/:id/confirm
  - Marks payment confirmed for the booking.
- GET /api/bookings/user/:userId
  - Returns all bookings for a user.
- GET /api/bookings/:id
  - Returns booking details.

## Data Model (JSON Files)
### users.json
Stores registered users.

Fields:
- id
- name
- email
- password (bcrypt hash)
- phone
- createdAt

### buses.json
Stores available buses.

Fields:
- id
- name
- from
- to
- departure
- arrival
- price
- totalSeats
- type
- availableDates

### bookings.json
Stores user bookings.

Fields:
- id
- bookingId
- busId
- userId
- busName
- from
- to
- date
- seats
- passengers
- totalAmount
- status
- createdAt
- paymentDate

## Security and Reliability Considerations
### Current Status
- JWT tokens are created but not actively used to protect endpoints.
- All CORS origins are allowed.
- Sensitive values are hardcoded.
- JSON file storage is not safe for concurrent writes.

### Risks
- Race conditions in booking if multiple users book the same seats at once.
- Tokens are not validated on booking endpoints.
- Potential data tampering if JSON files are accessible.

## Performance and Scalability
### Current Design
- Single-node Node.js process.
- File-based storage.

### Limitations
- File I/O can block under heavy load.
- No caching or pagination.
- No horizontal scalability built-in.

## Deployment Notes
### Current API Base URL
The frontend points to a hosted Render instance:
https://bus-booking-ory6.onrender.com/api

### Local Run Steps (Backend)
1) Go to backend/.
2) Run npm install.
3) Start the server with node server.js.
4) API available at http://localhost:3000.

## Suggested Improvements (Roadmap)
Short-term:
- Add input validation on all API routes.
- Move JWT secret to environment variables.
- Implement auth middleware and protect booking endpoints.

Mid-term:
- Replace JSON storage with a database.
- Add seat locking or temporary holds.
- Add booking cancellation and refund flow.

Long-term:
- Integrate a real payment gateway.
- Add admin tools for managing buses.
- Improve accessibility and localization.

## Testing Strategy (Proposed)
### Frontend
- Manual UI tests for each page and flow.
- Basic form validation checks.

### Backend
- Unit tests for route handlers.
- Integration tests for booking flow.

## Accessibility and UI Considerations
### Strengths
- Uses Bootstrap for consistent forms and layout.
- Clear seat legend for status.

### Improvements
- Add ARIA labels for interactive elements.
- Provide better focus states for keyboard navigation.
- Improve color contrast for booked/selected seats.

## Conclusion
Bus Booking is a clear and functional prototype that demonstrates end-to-end booking flow with a lightweight stack. The codebase is simple, easy to run, and well-suited for demos or learning. For production use, improvements around security, persistence, and payment integration would be necessary.
