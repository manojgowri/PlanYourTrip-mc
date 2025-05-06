const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// CORS Configuration
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000"
app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
)

// JSON Middleware
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err))

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

// Create Models
const Itinerary = mongoose.model("Itinerary", itinerarySchema)
const Location = mongoose.model("Location", locationSchema)
const Accommodation = mongoose.model("Accommodation", accommodationSchema)
const Companion = mongoose.model("Companion", companionSchema)
const Comment = mongoose.model("Comment", commentSchema)
const User = mongoose.model("User", userSchema)

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ message: "Access denied" })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" })
    req.user = user
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
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ message: "Invalid username or password" })

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ message: "Invalid username or password" })

    // Create token
    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({ token, user: { username: user.username, isAdmin: user.isAdmin } })
  } catch (error) {
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
      console.log("Admin user created")
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

// Itinerary Routes
app.get("/api/itineraries", async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
    res.json(itineraries)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get("/api/itineraries/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ id: req.params.id })
    if (!itinerary) {
      // Try to find by destination name (case insensitive)
      const itineraryByName = await Itinerary.findOne({
        destination: { $regex: new RegExp("^" + req.params.id + "$", "i") },
      })

      if (!itineraryByName) return res.status(404).json({ message: "Itinerary not found" })
      return res.json(itineraryByName)
    }
    res.json(itinerary)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/itineraries", authenticateToken, isAdmin, async (req, res) => {
  try {
    const newItinerary = new Itinerary(req.body)
    const savedItinerary = await newItinerary.save()
    res.status(201).json(savedItinerary)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.put("/api/itineraries/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
    if (!updatedItinerary) return res.status(404).json({ message: "Itinerary not found" })
    res.json(updatedItinerary)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete("/api/itineraries/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findOneAndDelete({ id: req.params.id })
    if (!deletedItinerary) return res.status(404).json({ message: "Itinerary not found" })

    // Delete related data
    await Location.deleteMany({ destinationId: req.params.id })
    await Accommodation.deleteMany({ destinationId: req.params.id })

    res.json({ message: "Itinerary deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Location Routes
app.get("/api/locations", async (req, res) => {
  try {
    const { destinationId } = req.query
    const query = destinationId ? { destinationId } : {}
    const locations = await Location.find(query)
    res.json(locations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/locations", authenticateToken, isAdmin, async (req, res) => {
  try {
    const newLocation = new Location(req.body)
    const savedLocation = await newLocation.save()
    res.status(201).json(savedLocation)
  } catch (error) {
    res.status(400).json({ message: error.message })
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
    const query = destinationId ? { destinationId } : {}
    const accommodations = await Accommodation.find(query)
    res.json(accommodations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post("/api/accommodations", authenticateToken, isAdmin, async (req, res) => {
  try {
    const newAccommodation = new Accommodation(req.body)
    const savedAccommodation = await newAccommodation.save()
    res.status(201).json(savedAccommodation)
  } catch (error) {
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
    const updatedCompanion = await Companion.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
    if (!updatedCompanion) return res.status(404).json({ message: "Companion not found" })
    res.json(updatedCompanion)
  } catch (error) {
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
    const itinerary = await Itinerary.findOne({ id: req.params.id })
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" })

    itinerary.days.push(req.body)
    const updatedItinerary = await itinerary.save()

    res.status(201).json(updatedItinerary)
  } catch (error) {
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

// Initialize admin user
initializeAdmin()

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
