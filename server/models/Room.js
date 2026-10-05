import mongoose from "mongoose"
const roomSchema = new mongoose.Schema({
  hotel: { name: String, city: String, address: String },
  roomType: String,
  pricePerNight: Number,
  amenities: [String],
  images: [String],
  isAvailable: { type: Boolean, default: true }
})
export default mongoose.model("Room", roomSchema)