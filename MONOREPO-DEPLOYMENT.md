# Monorepo Deployment Guide for Plan Your Trip Amigos

This guide explains how to deploy both frontend and backend from a single repository.

## Repository Structure

\`\`\`
plan-your-trip/
├── frontend/           # Next.js application
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json    # Frontend package.json
│   ├── next.config.js
│   └── ...
├── backend/            # Express server
│   ├── server.js
│   ├── package.json    # Backend package.json
│   └── ...
└── README.md
\`\`\`

## Environment Variables

### Backend (.env in backend folder)
\`\`\`
MONGODB_URI=mongodb+srv://travel_admin:Budget!Travel2023@cluster0.fiokxot.mongodb.net/plan-your-trip?retryWrites=true&w=majority
JWT_SECRET=4982af675ec347e8a2e1e2af9e870175
PORT=3001
CORS_ORIGIN=https://planyourtripamigos.vercel.app
\`\`\`

### Frontend (.env.local in frontend folder)
\`\`\`
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
\`\`\`

## Deployment Process

### 1. Backend Deployment to Render

1. **Create a new Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Web Service"

2. **Connect your repository**:
   - Select "GitHub" and connect your repository
   - **Important**: Set the Root Directory to `backend`

3. **Configure the service**:
   - Name: `PlanYourTrip-backendData`
   - Environment: Node
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`

4. **Add environment variables**:
   - Add all the backend environment variables listed above

5. **Create Web Service**:
   - Click "Create Web Service"

### 2. Frontend Deployment to Vercel

1. **Create a new project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" and select "Project"

2. **Import your repository**:
   - Select your repository
   - **Important**: Set the Root Directory to `frontend`

3. **Configure the project**:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add environment variables**:
   - Add `NEXT_PUBLIC_API_URL` pointing to your Render backend URL

5. **Deploy**:
   - Click "Deploy"

## Making Changes

When you make changes to your monorepo:

1. **For frontend changes**:
   - Make changes in the `frontend` directory
   - Commit and push to GitHub
   - Vercel will automatically detect changes in the `frontend` directory and deploy them

2. **For backend changes**:
   - Make changes in the `backend` directory
   - Commit and push to GitHub
   - Render will automatically detect changes in the `backend` directory and deploy them

## Advantages of Monorepo

1. **Single source of truth**: All code is in one place
2. **Easier coordination**: Frontend and backend changes can be committed together
3. **Simplified version control**: Single repository to manage
4. **Atomic changes**: Make related changes across frontend and backend in a single commit

## Troubleshooting

If you encounter deployment issues:

1. **Check Root Directory settings**: Make sure both Vercel and Render have the correct root directory settings
2. **Verify package.json files**: Ensure both frontend and backend have their own valid package.json files
3. **Check environment variables**: Confirm all environment variables are correctly set
4. **Review build logs**: Check the build logs in both Vercel and Render for specific errors
