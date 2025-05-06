# Deployment Guide for Plan Your Trip Amigos

This guide explains how to deploy the monorepo to Vercel (frontend) and Render (backend).

## Backend Deployment (Render)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `PlanYourTrip-backendData`
   - Environment: Node
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variables:
   \`\`\`
   MONGODB_URI=mongodb+srv://travel_admin:Budget!Travel2023@cluster0.fiokxot.mongodb.net/plan-your-trip?retryWrites=true&w=majority
   JWT_SECRET=4982af675ec347e8a2e1e2af9e870175
   PORT=3001
   CORS_ORIGIN=https://planyourtripamigos.vercel.app
   \`\`\`
6. Click "Create Web Service"

## Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://planyourtrip-backenddata.onrender.com/api
   \`\`\`
6. Click "Deploy"

## Troubleshooting

If you encounter deployment issues:

1. Check the build logs for specific errors
2. Verify that the Root Directory settings are correct
3. Ensure all environment variables are properly set
4. Confirm that package.json files have the correct dependencies and scripts

## Table of Contents
1. [Repository Structure](#repository-structure)
2. [Package.json Configuration](#packagejson-configuration)
3. [Environment Variables](#environment-variables)
4. [Git Setup and Workflow](#git-setup-and-workflow)
5. [Connecting Frontend and Backend](#connecting-frontend-and-backend)
6. [Maintenance and Updates](#maintenance-and-updates)
7. [Additional Resources](#additional-resources)

## Repository Structure

For a clean deployment, it's recommended to have separate repositories for frontend and backend:

### Option 1: Separate Repositories (Recommended)
- **Frontend Repository**: Contains Next.js application
- **Backend Repository**: Contains Express server

### Option 2: Monorepo Structure
If you prefer keeping everything in one repository:

\`\`\`
plan-your-trip/
├── frontend/           # Next.js application
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json    # Frontend package.json
│   └── ...
├── backend/            # Express server
│   ├── server.js
│   ├── package.json    # Backend package.json
│   └── ...
└── README.md
\`\`\`

## Package.json Configuration

### Frontend package.json
\`\`\`json
{
  "name": "plan-your-trip-frontend",
  "version": "1.0.0",
  "description": "Frontend for Plan Your Trip application",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "next-themes": "^0.2.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.4",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.3"
  }
}
\`\`\`

### Backend package.json
\`\`\`json
{
  "name": "plan-your-trip-backend",
  "version": "1.0.0",
  "description": "Backend for Plan Your Trip application",
  "main": "server.js",
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
\`\`\`

## Environment Variables

### Backend (.env)
Create a `.env` file in your backend directory:
\`\`\`
MONGODB_URI=mongodb+srv://travel_admin:Budget!Travel2023@cluster0.fiokxot.mongodb.net/plan-your-trip?retryWrites=true&w=majority
JWT_SECRET=4982af675ec347e8a2e1e2af9e870175
PORT=3001
CORS_ORIGIN=https://your-frontend-url.vercel.app
\`\`\`

### Frontend (.env.local)
Create a `.env.local` file in your frontend directory:
\`\`\`
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
\`\`\`

## Git Setup and Workflow

### Initial Setup
1. Create GitHub repositories for your frontend and backend
2. Initialize Git in each directory:
   \`\`\`bash
   # In frontend directory
   git init
   git add .
   git commit -m "Initial frontend commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/plan-your-trip-frontend.git
   git push -u origin main

   # In backend directory
   git init
   git add .
   git commit -m "Initial backend commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/plan-your-trip-backend.git
   git push -u origin main
   \`\`\`

### Making Changes
When making changes to your code:
1. Make your changes locally
2. Test locally to ensure everything works
3. Commit and push changes:
   \`\`\`bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   \`\`\`

### Fixing "An error occurred while pushing changes"

This error can occur for several reasons:

1. **Authentication Issues**:
   - Ensure you're authenticated with GitHub:
     \`\`\`bash
     git config --global user.name "Your Name"
     git config --global user.email "your.email@example.com"
     \`\`\`
   - Use a personal access token if password authentication fails:
     - Go to GitHub → Settings → Developer settings → Personal access tokens
     - Generate a new token with appropriate permissions
     - Use this token instead of your password when pushing

2. **Permission Issues**:
   - Ensure you have write access to the repository
   - If using an organization repository, check that you have the necessary permissions

3. **Network Issues**:
   - Check your internet connection
   - Try using HTTPS instead of SSH (or vice versa)

4. **Large Files**:
   - If you're trying to push large files, GitHub may reject them
   - Consider using Git LFS for large files or remove them from your repository

5. **Conflicting Changes**:
   - Pull the latest changes before pushing:
     \`\`\`bash
     git pull --rebase origin main
     git push origin main
     \`\`\`

## Connecting Frontend and Backend

### CORS Configuration

Ensure your backend server has CORS properly configured to accept requests from your frontend:

\`\`\`javascript
// In server.js
const cors = require('cors');
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
\`\`\`

### API URL Configuration

Make sure your frontend is using the correct API URL:

\`\`\`javascript
// In lib/data.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
\`\`\`

## Maintenance and Updates

### Updating Your Application

1. Make changes locally and test thoroughly
2. Commit and push changes to GitHub
3. Vercel and Render will automatically deploy the updates

### Monitoring

1. **Render Dashboard**:
   - Monitor your backend service health
   - Check logs for errors

2. **Vercel Dashboard**:
   - Monitor your frontend deployments
   - Check build and runtime logs

### Database Backups

Regularly backup your MongoDB database:
1. Go to MongoDB Atlas dashboard
2. Navigate to your cluster
3. Click "Backup" and create a backup

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
