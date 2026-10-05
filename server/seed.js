import mongoose from "mongoose"
import dotenv from "dotenv"
import Room from "./models/Room.js"
dotenv.config()

const hotel = { name: "Urbanza Suites", city: "New York", address: "Main Road 123 Street, 23 Colony" }
const base = const base = "https://darstay-hotel-booking-production.up.railway.app/images"
const img = (...n) => n.map((i) => `${base}/roomImg${i}.png`)

const rooms = [
  { hotel, roomType: "Double Bed", pricePerNight: 399, amenities: ["Room Service", "Mountain View", "Pool Access"], images: img(1, 2, 3, 4), isAvailable: true },
  { hotel, roomType: "Double Bed", pricePerNight: 299, amenities: ["Room Service", "Mountain View", "Pool Access"], images: img(2, 3, 4, 1), isAvailable: true },
  { hotel, roomType: "Double Bed", pricePerNight: 249, amenities: ["Free WiFi", "Free Breakfast", "Room Service"], images: img(3, 4, 1, 2), isAvailable: true },
  { hotel, roomType: "Single Bed", pricePerNight: 199, amenities: ["Free WiFi", "Room Service", "Pool Access"], images: img(4, 1, 2, 3), isAvailable: true }
]

await mongoose.connect(process.env.MONGO_URI)
await Room.deleteMany({})
const r = await Room.insertMany(rooms)
console.log(`seeded ${r.length} rooms`)
await mongoose.disconnect()
