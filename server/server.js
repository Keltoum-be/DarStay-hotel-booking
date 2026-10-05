import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import roomRoutes from "./routes/rooms.js"
import hotelRoutes from "./routes/hotels.js"
import bookingRoutes from "./routes/bookings.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express();

app.use("/images", express.static(path.join(__dirname,"public/images")))

// --- هادي هي الفكس ديال featured ---
app.use(cors({
  origin: true, // كيقبل أي origin
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
  credentials: true
}))

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongo Connected"))
.catch((err) => console.error("Mongo error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/hotels", hotelRoutes)
app.use("/api/bookings", bookingRoutes)

app.get("/", (req,res) => res.send("API Running"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server on ${PORT}`))