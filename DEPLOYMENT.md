# Deployment Guide for Plan Your Trip Amigos

This guide will help you deploy the application to Render and connect it to MongoDB Atlas.

## MongoDB Atlas Setup

1. Your MongoDB connection string is already configured in the `.env` file:
   \`\`\`
   MONGODB_URI=mongodb+srv://travel_admin:Budget!Travel2023@cluster0.fiokxot.mongodb.net/plan-your-trip?retryWrites=true&w=majority
   \`\`\`

2. Make sure your MongoDB Atlas cluster allows connections from anywhere (or at least from Render's IP addresses).
   - Go to Network Access in MongoDB Atlas
   - Add your current IP or set it to allow access from anywhere (0.0.0.0/0)

## Render Deployment

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Name: `PlanYourTrip-backendData`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Region: Singapore (Southeast Asia)

4. Add the following environment variables:
   - `MONGODB_URI`: `mongodb+srv://travel_admin:Budget!Travel2023@cluster0.fiokxot.mongodb.net/plan-your-trip?retryWrites=true&w=majority`
   - `JWT_SECRET`: `4982af675ec347e8a2e1e2af9e870175`
   - `PORT`: `3001`

5. Click "Create Web Service"

### Frontend Deployment

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure the service:
   - Name: `PlanYourTrip-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `out` or `.next` (depending on your Next.js export settings)
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: The URL of your backend service (e.g., `https://planyourtrip-backenddata.onrender.com/api`)

4. Click "Create Static Site"

## Image Storage

Currently, the application stores image URLs rather than the actual images. For a production application, you would want to:

1. Set up a cloud storage service like AWS S3, Google Cloud Storage, or Vercel Blob
2. Implement image upload functionality in the frontend
3. Store the image URLs in MongoDB

For now, you can use placeholder images or direct URLs to images hosted elsewhere.

## Troubleshooting

If you encounter the "an error has occurred" toast message during deployment:

1. Check the Render logs for specific error messages
2. Verify that your MongoDB connection string is correct
3. Ensure that your MongoDB Atlas cluster is accessible from Render
4. Check that all environment variables are correctly set in Render

## How MongoDB and Render Are Connected

1. The backend server (server.js) connects to MongoDB using the connection string in the MONGODB_URI environment variable
2. The frontend makes API calls to the backend, which then queries MongoDB
3. Render hosts both the frontend and backend, with the frontend making requests to the backend API

This separation of concerns allows for better scalability and security.
