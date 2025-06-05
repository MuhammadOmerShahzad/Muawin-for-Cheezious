# Muawin Backend

This is the backend server for the Muawin application, built with Node.js, Express, and MongoDB.

## Directory Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── .env           # Environment variables
├── app.js         # Main application file
└── package.json   # Project dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/muawin
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/users/create` - Create a new user
- POST `/api/users/signin` - Sign in user

### Zones
- POST `/api/zones/initialize` - Initialize zones
- GET `/api/zones` - Get all zones
- GET `/api/zones/:zoneName/branches` - Get branches by zone
- POST `/api/zones/:zoneName/branches` - Add branch to zone
- PUT `/api/zones/:zoneId/branches` - Update branch in zone
- DELETE `/api/zones/:zoneId/branches` - Delete branch from zone

### Tasks
- POST `/api/tasks` - Add a new task
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/:id` - Get task by ID
- PUT `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task

### Assigned Tasks
- POST `/api/assigned-tasks` - Add a new assigned task
- GET `/api/assigned-tasks` - Get assigned tasks
- PUT `/api/assigned-tasks/:taskId/complete` - Mark task as completed

### Announcements
- POST `/api/announcements` - Add a new announcement
- GET `/api/announcements` - Get all announcements
- GET `/api/announcements/latest` - Get latest announcement

### Tickets
- POST `/api/tickets` - Create a new ticket
- GET `/api/tickets` - Get all tickets
- GET `/api/tickets/:ticketId` - Get ticket by ID
- PUT `/api/tickets/:ticketId/status` - Update ticket status
- DELETE `/api/tickets/:ticketId` - Delete a ticket

### Files
- POST `/api/files/:category/:zone/:branch` - Upload a file
- GET `/api/files/:category/:zone/:branch` - Get files by category
- GET `/api/files/download/:filename` - Download a file
- DELETE `/api/files/:category/:zone/:branch/:filename` - Delete a file

## Testing

Run tests using:
```bash
npm test
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security

- JWT authentication for protected routes
- Password hashing using bcrypt
- Input validation and sanitization
- CORS enabled
- Environment variables for sensitive data 