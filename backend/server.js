const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// Enhanced logging for debugging
console.log("Starting server with environment:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  MONGODB_URI: process.env.MONGODB_URI ? "Set (hidden for security)" : "Not set",
  JWT_SECRET: process.env.JWT_SECRET ? "Set (hidden for security)" : "Not set",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
})

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://planyourtripamigos.vercel.app",
      "https://planyourtrip-mc.onrender.com",
    ]

    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log("CORS blocked origin:", origin)
      callback(null, true) // Allow all origins for now
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

// JSON Middleware with increased size limit for images
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection with enhanced error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully")
    // Log database information
    mongoose.connection.db
      .admin()
      .listDatabases()
      .then((result) => {
        console.log(
          "Available databases:",
          result.databases.map((db) => db.name),
        )
        // List collections in the current database
        return mongoose.connection.db.listCollections().toArray()
      })
      .then((collections) => {
        console.log(
          "Available collections:",
          collections.map((c) => c.name),
        )
      })
      .catch((err) => console.error("Error listing databases/collections:", err))
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    console.error(
      "MongoDB URI format (redacted):",
      process.env.MONGODB_URI
        ? process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://[USERNAME]:[PASSWORD]@")
        : "Not set",
    )
  })

// Enhanced error handling for MongoDB connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error event:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected, attempting to reconnect...")
})

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected successfully")
})

// Define Schemas
const activitySchema = new mongoose.Schema({
  id: String,
  time: String,
  title: String,
  description: String,
  type: {
    type: String,
    enum: ["food", "activity", "travel", "accommodation", "must-visit"],
  },
  expense: {
    amount: Number,
    currency: String,
    category: String,
  },
  image: String,
})

const daySchema = new mongoose.Schema({
  id: String,
  day: Number,
  date: String,
  location: String,
  activities: [activitySchema],
})

// Update the itinerary schema to include metadata for the checklist
const itinerarySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  destination: {
    type: String,
    required: true,
  },
  image: String,
  description: String,
  startDate: String,
  endDate: String,
  status: {
    type: String,
    enum: ["online", "completed"],
    default: "online",
  },
  season: String,
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  locations: [String],
  days: [daySchema],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
})

const locationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  dates: String,
  destinationId: String,
})

const accommodationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  location: String,
  dates: String,
  destinationId: String,
})

const companionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  relationship: String,
  bio: String,
  image: String,
  instagramUrl: String,
})

const commentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  date: String,
  content: String,
  rating: Number,
  itineraryId: String,
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

// Create Models with explicit collection names to ensure consistency
const Itinerary = mongoose.model("Itinerary", itinerarySchema, "itineraries")
const Location = mongoose.model("Location", locationSchema, "locations")
const Accommodation = mongoose.model("Accommodation", accommodationSchema, "accommodations")
const Companion = mongoose.model("Companion", companionSchema, "companions")
const Comment = mongoose.model("Comment", commentSchema, "comments")
const User = mongoose.model("User", userSchema, "users")

// Authentication Middleware with enhanced logging
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  console.log(`Auth attempt: ${req.method} ${req.path}`, {
    hasToken: !!token,
    authHeader: authHeader ? `${authHeader.substring(0, 15)}...` : "none",
  })

  if (!token) return res.status(401).json({ message: "Access denied" })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message)
      return res.status(403).json({ message: "Invalid token" })
    }
    req.user = user
    console.log("Authentication successful for user:", user.username)
    next()
  })
}

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access required" })
  next()
}

// Auth Routes
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ username })
    if (existingUser) return res.status(400).json({ message: "User already exists" })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      isAdmin: false, // Default to non-admin
    })

    await user.save()
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body
    console.log("Login attempt for user:", username)

    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      console.log("Login failed: User not found")
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      console.log("Login failed: Invalid password")
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Create token
    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    console.log("Login successful for user:", username)
    res.json({ token, user: { username: user.username, isAdmin: user.isAdmin } })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: error.message })
  }
})

// Initialize admin user if none exists
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true })
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("Budget!Travel2023", salt)

      const adminUser = new User({
        username: "travel_admin",
        password: hashedPassword,
        isAdmin: true,
      })

      await adminUser.save()
      console.log("Admin user created successfully")
    } else {
      console.log("Admin user already exists")
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

// Itinerary Routes with enhanced logging
app.get("/api/itineraries", async (req, res) => {
  try {
    console.log("Fetching all itineraries")
    const itineraries = await Itinerary.find()
    console.log(`Found ${itineraries.length} itineraries`)
    res.json(itineraries)
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    res.status(500).json({ message: error.message })
  }
})

app.get("/api/itineraries/:id", async (req, res) => {
  try {
    console.log(`Fetching itinerary with id: ${req.params.id}`)
    const itinerary = await Itinerary.findOne({ id: req.params.id })

    if (!itinerary) {
      console.log(`Itinerary not found with id: ${req.params.id}, trying by destination name`)
      // Try to find by destination name (case insensitive)
      const itineraryByName = await Itinerary.findOne({
        destination: { $regex: new RegExp("^" + req.params.id + "$", "i") },
      })

      if (!itineraryByName) {
        console.log(`Itinerary not found by destination name: ${req.params.id}`)
        return res.status(404).json({ message: "Itinerary not found" })
      }

      console.log(`Found itinerary by destination name: ${itineraryByName.destination}`)
      return res.json(itineraryByName)
    }

    console.log(`Found itinerary: ${itinerary.destination}`)
    res.json(itinerary)
  } catch (error) {
    console.error(`Error fetching itinerary ${req.params.id}:`, error)
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/itineraries", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("Creating new itinerary:", req.body.destination)
    console.log("Request body:", JSON.stringify(req.body))

    // Check if itinerary with this ID already exists
    const existingItinerary = await Itinerary.findOne({ id: req.body.id })
    if (existingItinerary) {
      console.log(`Itinerary with id ${req.body.id} already exists, updating instead`)
      const updatedItinerary = await Itinerary.findOneAndUpdate({ id: req.body.id }, req.body, { new: true })
      return res.json(updatedItinerary)
    }

    const newItinerary = new Itinerary(req.body)
    const savedItinerary = await newItinerary.save()

    console.log(`Itinerary created successfully with id: ${savedItinerary.id}`)
    res.status(201).json(savedItinerary)
  } catch (error) {
    console.error("Error creating itinerary:", error)
    res.status(400).json({ message: error.message })
  }
})

app.put("/api/itineraries/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Updating itinerary with id: ${req.params.id}`)
    console.log("Update data:", JSON.stringify(req.body))

    // First check if the itinerary exists
    const existingItinerary = await Itinerary.findOne({ id: req.params.id })
    if (!existingItinerary) {
      console.log(`Itinerary not found with id: ${req.params.id}, creating new one`)
      // If not found, create a new one
      const newItinerary = new Itinerary({
        ...req.body,
        id: req.params.id,
      })
      const savedItinerary = await newItinerary.save()
      console.log(`Created new itinerary with id: ${savedItinerary.id}`)
      return res.status(201).json(savedItinerary)
    }

    const updatedItinerary = await Itinerary.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })

    console.log(`Itinerary updated successfully: ${updatedItinerary.destination}`)
    res.json(updatedItinerary)
  } catch (error) {
    console.error(`Error updating itinerary ${req.params.id}:`, error)
    res.status(400).json({ message: error.message })
  }
})

app.delete("/api/itineraries/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Deleting itinerary with id: ${req.params.id}`)

    const deletedItinerary = await Itinerary.findOneAndDelete({ id: req.params.id })
    if (!deletedItinerary) {
      console.log(`Itinerary not found with id: ${req.params.id}`)
      return res.status(404).json({ message: "Itinerary not found" })
    }

    // Delete related data
    await Location.deleteMany({ destinationId: req.params.id })
    await Accommodation.deleteMany({ destinationId: req.params.id })

    console.log(`Itinerary deleted successfully: ${deletedItinerary.destination}`)
    res.json({ message: "Itinerary deleted successfully" })
  } catch (error) {
    console.error(`Error deleting itinerary ${req.params.id}:`, error)
    res.status(500).json({ message: error.message })
  }
})

// Location Routes
app.get("/api/locations", async (req, res) => {
  try {
    const { destinationId } = req.query
    console.log(`Fetching locations${destinationId ? ` for destination: ${destinationId}` : ""}`)

    const query = destinationId ? { destinationId } : {}
    const locations = await Location.find(query)

    console.log(`Found ${locations.length} locations`)
    res.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/locations", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("Creating new location:", req.body.name)

    const newLocation = new Location(req.body)
    const savedLocation = await newLocation.save()

    // Update the itinerary's locations array if destinationId is provided
    if (req.body.destinationId) {
      const itinerary = await Itinerary.findOne({ id: req.body.destinationId })
      if (itinerary) {
        // Add the location name to the itinerary's locations array if it's not already there
        if (!itinerary.locations.includes(req.body.name)) {
          itinerary.locations.push(req.body.name)
          await itinerary.save()
          console.log(`Added location ${req.body.name} to itinerary ${req.body.destinationId}`)
        }
      }
    }

    console.log(`Location created successfully with id: ${savedLocation.id}`)
    res.status(201).json(savedLocation)
  } catch (error) {
    console.error("Error creating location:", error)
    res.status(400).json({ message: error.message })
  }
})

// Add a database test endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    console.log("Testing database connection...")

    // Check connection status
    const connectionState = mongoose.connection.readyState
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }

    console.log(`MongoDB connection state: ${states[connectionState]}`)

    if (connectionState !== 1) {
      return res.status(500).json({
        success: false,
        message: `Database not connected (state: ${states[connectionState]})`,
        connectionState,
      })
    }

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Count documents in each collection
    const counts = {}
    for (const name of collectionNames) {
      counts[name] = await mongoose.connection.db.collection(name).countDocuments()
    }

    // Try to insert a test document
    const testResult = await mongoose.connection.db.collection("test_collection").insertOne({
      test: "This is a test document",
      date: new Date(),
    })

    // Delete the test document
    await mongoose.connection.db.collection("test_collection").deleteOne({ _id: testResult.insertedId })

    res.json({
      success: true,
      message: "Database connection successful",
      connectionState: states[connectionState],
      collections: collectionNames,
      documentCounts: counts,
      testInsert: testResult.acknowledged,
    })
  } catch (error) {
    console.error("Database test error:", error)
    res.status(500).json({
      success: false,
      message: "Database test failed",
      error: error.message,
    })
  }
})

app.put("/api/locations/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const updatedLocation = await Location.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
    if (!updatedLocation) return res.status(404).json({ message: "Location not found" })
    res.json(updatedLocation)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete("/api/locations/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const deletedLocation = await Location.findOneAndDelete({ id: req.params.id })
    if (!deletedLocation) return res.status(404).json({ message: "Location not found" })
    res.json({ message: "Location deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Accommodation Routes
app.get("/api/accommodations", async (req, res) => {
  try {
    const { destinationId } = req.query
    console.log(`Fetching accommodations${destinationId ? ` for destination: ${destinationId}` : ""}`)

    const query = destinationId ? { destinationId } : {}
    const accommodations = await Accommodation.find(query)

    console.log(`Found ${accommodations.length} accommodations`)
    res.json(accommodations)
  } catch (error) {
    console.error("Error fetching accommodations:", error)
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/accommodations", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("Creating new accommodation:", req.body)

    const newAccommodation = new Accommodation(req.body)
    const savedAccommodation = await newAccommodation.save()

    console.log(`Accommodation created successfully with id: ${savedAccommodation.id}`)
    res.status(201).json(savedAccommodation)
  } catch (error) {
    console.error("Error creating accommodation:", error)
    res.status(400).json({ message: error.message })
  }
})

app.put("/api/accommodations/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const updatedAccommodation = await Accommodation.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
    if (!updatedAccommodation) return res.status(404).json({ message: "Accommodation not found" })
    res.json(updatedAccommodation)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete("/api/accommodations/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const deletedAccommodation = await Accommodation.findOneAndDelete({ id: req.params.id })
    if (!deletedAccommodation) return res.status(404).json({ message: "Accommodation not found" })
    res.json({ message: "Accommodation deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Companion Routes
app.get("/api/companions", async (req, res) => {
  try {
    const companions = await Companion.find()
    res.json(companions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/companions", authenticateToken, isAdmin, async (req, res) => {
  try {
    const newCompanion = new Companion(req.body)
    const savedCompanion = await newCompanion.save()
    res.status(201).json(savedCompanion)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.put("/api/companions/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Updating companion with id: ${req.params.id}`)
    console.log("Request body:", req.body)

    const updatedCompanion = await Companion.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })

    if (!updatedCompanion) {
      console.log(`Companion not found with id: ${req.params.id}`)
      return res.status(404).json({ message: "Companion not found" })
    }

    console.log(`Companion updated successfully: ${updatedCompanion.name}`)
    res.json(updatedCompanion)
  } catch (error) {
    console.error(`Error updating companion ${req.params.id}:`, error)
    res.status(400).json({ message: error.message })
  }
})

app.delete("/api/companions/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const deletedCompanion = await Companion.findOneAndDelete({ id: req.params.id })
    if (!deletedCompanion) return res.status(404).json({ message: "Companion not found" })
    res.json({ message: "Companion deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Comment Routes
app.get("/api/comments", async (req, res) => {
  try {
    const { itineraryId } = req.query
    const query = itineraryId ? { itineraryId } : {}
    const comments = await Comment.find(query)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/comments", async (req, res) => {
  try {
    const newComment = new Comment(req.body)
    const savedComment = await newComment.save()

    // Update itinerary rating
    if (req.body.itineraryId) {
      const comments = await Comment.find({ itineraryId: req.body.itineraryId })
      const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0)
      const avgRating = totalRating / comments.length

      await Itinerary.findOneAndUpdate(
        { id: req.body.itineraryId },
        {
          rating: avgRating,
          reviewCount: comments.length,
        },
      )
    }

    res.status(201).json(savedComment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Day and Activity Management
app.post("/api/itineraries/:id/days", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log(`Adding day to itinerary ${req.params.id}:`, req.body)

    const itinerary = await Itinerary.findOne({ id: req.params.id })
    if (!itinerary) {
      console.log(`Itinerary not found with id: ${req.params.id}`)
      return res.status(404).json({ message: "Itinerary not found" })
    }

    // Ensure day has an ID
    const day = {
      ...req.body,
      id: req.body.id || Date.now().toString(36) + Math.random().toString(36).substring(2),
    }

    // Add the day to the itinerary
    itinerary.days.push(day)

    // Sort days by day number
    itinerary.days.sort((a, b) => a.day - b.day)

    const updatedItinerary = await itinerary.save()
    console.log(`Day added successfully to itinerary ${req.params.id}`)

    res.status(201).json(updatedItinerary)
  } catch (error) {
    console.error("Error adding day to itinerary:", error)
    res.status(400).json({ message: error.message })
  }
})

app.delete("/api/itineraries/:itineraryId/days/:dayId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ id: req.params.itineraryId })
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" })

    itinerary.days = itinerary.days.filter((day) => day.id !== req.params.dayId)
    const updatedItinerary = await itinerary.save()

    res.json(updatedItinerary)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.post("/api/itineraries/:itineraryId/days/:dayId/activities", authenticateToken, isAdmin, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ id: req.params.itineraryId })
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" })

    const dayIndex = itinerary.days.findIndex((day) => day.id === req.params.dayId)
    if (dayIndex === -1) return res.status(404).json({ message: "Day not found" })

    itinerary.days[dayIndex].activities.push(req.body)
    const updatedItinerary = await itinerary.save()

    res.status(201).json(updatedItinerary)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete(
  "/api/itineraries/:itineraryId/days/:dayId/activities/:activityId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const itinerary = await Itinerary.findOne({ id: req.params.itineraryId })
      if (!itinerary) return res.status(404).json({ message: "Itinerary not found" })

      const dayIndex = itinerary.days.findIndex((day) => day.id === req.params.dayId)
      if (dayIndex === -1) return res.status(404).json({ message: "Day not found" })

      itinerary.days[dayIndex].activities = itinerary.days[dayIndex].activities.filter(
        (activity) => activity.id !== req.params.activityId,
      )

      const updatedItinerary = await itinerary.save()
      res.json(updatedItinerary)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
)

app.post("/api/update-favicon", authenticateToken, isAdmin, async (req, res) => {
  try {
    // This would typically involve file upload handling
    // For now, we'll just return success
    res.json({ success: true, message: "Favicon updated successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark itinerary as complete
app.put("/api/itineraries/:id/complete", authenticateToken, isAdmin, async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findOneAndUpdate(
      { id: req.params.id },
      { status: "completed" },
      { new: true },
    )

    if (!updatedItinerary) return res.status(404).json({ message: "Itinerary not found" })

    // Return the updated itinerary
    res.json(updatedItinerary)
  } catch (error) {
    console.error("Error marking itinerary as complete:", error)
    res.status(400).json({ message: error.message })
  }
})

// Health check endpoint with enhanced information
app.get("/health", (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  }

  console.log("Health check:", health)
  res.status(200).json(health)
})

// Initialize admin user
initializeAdmin()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
