import mongoose from "mongoose"

const hotelSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    contact: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    city: String
  },
  { timestamps: true }
)

export default mongoose.model("Hotel", hotelSchema)