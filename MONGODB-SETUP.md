# MongoDB Setup Guide for Vietnam Travel Application

This guide will help you set up the necessary MongoDB collections and schemas for the Vietnam Travel Application.

## Database Structure

The application uses the following collections:

1. **itineraries** - Stores travel itinerary information
2. **locations** - Stores location details for each itinerary
3. **accommodations** - Stores accommodation details for each itinerary
4. **companions** - Stores travel companion information
5. **comments** - Stores user comments and reviews for itineraries
6. **users** - Stores admin user credentials

## Collection Schemas

### 1. Itineraries Collection

\`\`\`javascript
{
  id: String,                // Unique identifier
  destination: String,       // Name of the destination
  image: String,             // URL to the cover image
  description: String,       // Description of the trip
  startDate: String,         // Start date of the trip
  endDate: String,           // End date of the trip
  status: String,            // "online" or "completed"
  season: String,            // Season of travel (Spring, Summer, Fall, Winter)
  rating: Number,            // Average rating (0-5)
  reviewCount: Number,       // Number of reviews
  locations: [String],       // Array of location names
  days: [                    // Array of day objects
    {
      id: String,            // Unique identifier for the day
      day: Number,           // Day number in the itinerary
      date: String,          // Date of this day
      location: String,      // Location for this day
      activities: [          // Array of activities for this day
        {
          id: String,        // Unique identifier for the activity
          time: String,      // Time of the activity
          title: String,     // Title of the activity
          description: String, // Description of the activity
          type: String,      // Type: "food", "activity", "travel", "accommodation", "must-visit"
          expense: {         // Optional expense information
            amount: Number,  // Cost amount
            currency: String, // Currency code
            category: String  // Expense category
          },
          image: String      // Optional image URL
        }
      ]
    }
  ]
}
\`\`\`

### 2. Locations Collection

\`\`\`javascript
{
  id: String,           // Unique identifier
  name: String,         // Name of the location
  dates: String,        // Dates of stay (e.g., "Jan 1 - Jan 5")
  destinationId: String // Reference to the itinerary
}
\`\`\`

### 3. Accommodations Collection

\`\`\`javascript
{
  id: String,           // Unique identifier
  name: String,         // Name of the accommodation
  location: String,     // Location of the accommodation
  dates: String,        // Dates of stay (e.g., "Jan 1 - Jan 5")
  destinationId: String // Reference to the itinerary
}
\`\`\`

### 4. Companions Collection

\`\`\`javascript
{
  id: String,           // Unique identifier
  name: String,         // Name of the companion
  relationship: String, // Relationship to the user
  bio: String,          // Bio description
  image: String         // URL to the companion's image
}
\`\`\`

### 5. Comments Collection

\`\`\`javascript
{
  id: String,           // Unique identifier
  name: String,         // Name of the commenter
  date: String,         // Date of the comment
  content: String,      // Comment content
  rating: Number,       // Rating (0-5)
  itineraryId: String   // Reference to the itinerary
}
\`\`\`

### 6. Users Collection

\`\`\`javascript
{
  username: String,     // Username for login
  password: String,     // Hashed password
  isAdmin: Boolean      // Admin status
}
\`\`\`

## Setting Up MongoDB

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster

2. **Set Up Database Access**:
   - Create a database user with read/write permissions
   - Save the username and password

3. **Set Up Network Access**:
   - Add your IP address to the IP Access List
   - For development, you can allow access from anywhere (0.0.0.0/0)

4. **Get Your Connection String**:
   - Go to "Clusters" > "Connect" > "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password

5. **Update Environment Variables**:
   - Add the connection string to your `.env.local` file as `MONGODB_URI`

## Initial Setup

When you first run the application, it will automatically create an admin user with the following credentials:

- Username: `travel_admin`
- Password: `Budget!Travel2023`

You can use these credentials to log in to the admin panel and start adding itineraries, companions, and other data.

## Troubleshooting

If you're having issues with data not appearing or being saved:

1. **Check MongoDB Connection**:
   - Verify your connection string is correct
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **Check Console Errors**:
   - Look for any error messages in the browser console or server logs

3. **Verify Data Format**:
   - Ensure all required fields are provided when creating new items
   - Check that dates are in the correct format

4. **Authentication Issues**:
   - Make sure you're logged in as an admin user
   - Check that your JWT token is valid and not expired
\`\`\`

Now let's update the app layout to include the footer only once:

```typescriptreact file="frontend/app/layout.tsx"
[v0-no-op-code-block-prefix]import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToastContainer } from "@/components/toast-container"
import { OfflineIndicator } from "@/components/offline-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plan Your Trip Amigos",
  description: "Your personal travel planner and itinerary manager",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
          <OfflineIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
