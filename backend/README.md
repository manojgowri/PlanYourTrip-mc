# Plan Your Trip Backend

This is the backend server for the Plan Your Trip application.

## Setup Instructions

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Create a `.env` file with the following variables:
   \`\`\`
   PORT=3001
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/plan-your-trip?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_here
   CORS_ORIGIN=*
   \`\`\`

3. Replace the placeholders in the MongoDB URI with your actual MongoDB Atlas credentials.

4. Start the server:
   \`\`\`
   npm start
   \`\`\`

## Environment Variables

- `PORT`: The port on which the server will run (default: 3001)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `CORS_ORIGIN`: Allowed origins for CORS (use "*" for development, specify exact origins for production)

## API Endpoints

### Authentication
- `POST /api/register`: Register a new user
- `POST /api/login`: Login and get JWT token

### Itineraries
- `GET /api/itineraries`: Get all itineraries
- `GET /api/itineraries/:id`: Get itinerary by ID or destination name
- `POST /api/itineraries`: Create a new itinerary (admin only)
- `PUT /api/itineraries/:id`: Update an itinerary (admin only)
- `DELETE /api/itineraries/:id`: Delete an itinerary (admin only)

### Locations
- `GET /api/locations`: Get all locations
- `POST /api/locations`: Create a new location (admin only)
- `PUT /api/locations/:id`: Update a location (admin only)
- `DELETE /api/locations/:id`: Delete a location (admin only)

### Accommodations
- `GET /api/accommodations`: Get all accommodations
- `POST /api/accommodations`: Create a new accommodation (admin only)
- `PUT /api/accommodations/:id`: Update an accommodation (admin only)
- `DELETE /api/accommodations/:id`: Delete an accommodation (admin only)

### Companions
- `GET /api/companions`: Get all companions
- `POST /api/companions`: Create a new companion (admin only)
- `PUT /api/companions/:id`: Update a companion (admin only)
- `DELETE /api/companions/:id`: Delete a companion (admin only)

### Comments
- `GET /api/comments`: Get all comments
- `POST /api/comments`: Create a new comment

### Days and Activities
- `POST /api/itineraries/:id/days`: Add a day to an itinerary (admin only)
- `DELETE /api/itineraries/:itineraryId/days/:dayId`: Delete a day from an itinerary (admin only)
- `POST /api/itineraries/:itineraryId/days/:dayId/activities`: Add an activity to a day (admin only)
- `DELETE /api/itineraries/:itineraryId/days/:dayId/activities/:activityId`: Delete an activity from a day (admin only)

### Utilities
- `GET /api/test-db`: Test database connection
- `GET /health`: Check server health

## Default Admin User

Username: travel_admin
Password: Budget!Travel2023
\`\`\`

Let's update the frontend data.ts file to handle the CORS configuration:
