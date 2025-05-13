const express = require("express")
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")
const shortid = require("shortid")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://planyourtripamigos.vercel.app"],
    credentials: true,
  }),
)
app.use(express.json({ limit: "50mb" }))

// Database connection
let db

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("Connected to MongoDB")
    db = client.db("travel_planner")

    // Create indexes for better performance
    await db.collection("itineraries").createIndex({ id: 1 }, { unique: true })
    await db.collection("companions").createIndex({ id: 1 }, { unique: true })

    return client
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" })
  }
  next()
}

// Routes
app.get("/", (req, res) => {
  res.send("Travel Planner API is running")
})

// Test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Get counts for each collection
    const counts = {}
    for (const name of collectionNames) {
      counts[name] = await db.collection(name).countDocuments()
    }

    res.json({
      status: "connected",
      database: db.databaseName,
      collections: collectionNames,
      counts,
      mongodbUri: MONGODB_URI ? MONGODB_URI.substring(0, 20) + "..." : "Not set",
    })
  } catch (error) {
    console.error("Database test error:", error)
    res.status(500).json({
      status: "error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Auth routes
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await db.collection("users").findOne({ username })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create admin user if it doesn't exist
async function createAdminUser() {
  try {
    const adminExists = await db.collection("users").findOne({ username: "travel_admin" })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.collection("users").insertOne({
        username: "travel_admin",
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date(),
      })
      console.log("Admin user created")
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

// Itinerary routes
app.get("/api/itineraries", async (req, res) => {
  try {
    const itineraries = await db.collection("itineraries").find().toArray()
    res.json(itineraries)
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/itineraries/:id", async (req, res) => {
  try {
    const itinerary = await db.collection("itineraries").findOne({ id: req.params.id })

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    res.json(itinerary)
  } catch (error) {
    console.error("Error fetching itinerary:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/itineraries", authenticateToken, isAdmin, async (req, res) => {
  try {
    const newItinerary = {
      ...req.body,
      id: shortid.generate(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("itineraries").insertOne(newItinerary)
    res.status(201).json(newItinerary)
  } catch (error) {
    console.error("Error creating itinerary:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/itineraries/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const updates = {
      ...req.body,
      updatedAt: new Date(),
    }

    const result = await db.collection("itineraries").updateOne({ id }, { $set: updates })

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    res.json({ message: "Itinerary updated", id })
  } catch (error) {
    console.error("Error updating itinerary:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/api/itineraries/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.collection("itineraries").deleteOne({ id })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    res.json({ message: "Itinerary deleted", id })
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Companion routes
app.get("/api/companions", async (req, res) => {
  try {
    const companions = await db.collection("companions").find().toArray()
    res.json(companions)
  } catch (error) {
    console.error("Error fetching companions:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/companions/:id", async (req, res) => {
  try {
    const companion = await db.collection("companions").findOne({ id: req.params.id })

    if (!companion) {
      return res.status(404).json({ message: "Companion not found" })
    }

    res.json(companion)
  } catch (error) {
    console.error("Error fetching companion:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/companions", authenticateToken, isAdmin, async (req, res) => {
  try {
    const newCompanion = {
      ...req.body,
      id: req.body.id || shortid.generate(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("companions").insertOne(newCompanion)
    res.status(201).json(newCompanion)
  } catch (error) {
    console.error("Error creating companion:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/companions/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    console.log(`Updating companion with ID: ${id}`)
    console.log("Request body:", req.body)

    const updates = {
      ...req.body,
      updatedAt: new Date(),
    }

    // First check if the companion exists
    const existingCompanion = await db.collection("companions").findOne({ id })

    if (!existingCompanion) {
      console.log(`Companion with ID ${id} not found`)
      return res.status(404).json({ message: "Companion not found" })
    }

    const result = await db.collection("companions").updateOne({ id }, { $set: updates })

    console.log("Update result:", result)

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Companion not found" })
    }

    res.json({ message: "Companion updated", id })
  } catch (error) {
    console.error("Error updating companion:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.delete("/api/companions/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.collection("companions").deleteOne({ id })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Companion not found" })
    }

    res.json({ message: "Companion deleted", id })
  } catch (error) {
    console.error("Error deleting companion:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Start server
async function startServer() {
  const client = await connectToDatabase()
  await createAdminUser()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  // Handle shutdown gracefully
  process.on("SIGINT", async () => {
    await client.close()
    console.log("MongoDB connection closed")
    process.exit(0)
  })
}

startServer().catch(console.error)
