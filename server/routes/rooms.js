import express from "express"
import mongoose from "mongoose"
import Room from "../models/Room.js"

const router = express.Router()

const BASE_URL = "https://darstay-hotel-booking-production.up.railway.app"

const fixImages = (rooms) => {
  return rooms.map(room => {
    const r = room.toObject? room.toObject() : {...room._doc || room }
    return {
    ...r,
      images: r.images?.map(img => {
        if (!img) return img
        if (img.includes("localhost")) {
          return img.replace(/http:\/\/localhost:\d+/, BASE_URL)
        }
        if (img.startsWith("/images/")) {
          return `${BASE_URL}${img}`
        }
        return img
      }) || []
    }
  })
}

// GET /api/rooms?roomType=Double Bed&minPrice=100&maxPrice=500&sort=price_asc|price_desc|newest
router.get("/", async (req, res) => {
  try {
    const { roomType, minPrice, maxPrice, sort } = req.query
    const filter = {}
    const clean = (v) => (v &&!["null", "undefined"].includes(String(v))? String(v) : "")
    const min = clean(minPrice), max = clean(maxPrice), type = clean(roomType)
    if (type) filter.roomType = { $in: type.split(",") }
    if ((min && Number.isFinite(Number(min))) || (max && Number.isFinite(Number(max)))) {
      filter.pricePerNight = {}
      if (min && Number.isFinite(Number(min))) filter.pricePerNight.$gte = Number(min)
      if (max && Number.isFinite(Number(max))) filter.pricePerNight.$lte = Number(max)
    }
    const sorts = { price_asc: { pricePerNight: 1 }, price_desc: { pricePerNight: -1 }, newest: { _id: -1 } }
    const rooms = await Room.find(filter).sort(sorts[sort] || {})
    res.json(fixImages(rooms))
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ msg: "Invalid id" })
    const room = await Room.findById(req.params.id)
    if (!room) return res.status(404).json({ msg: "Room not found" })
    res.json(fixImages([room])[0])
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message })
  }
})

export default router
 
