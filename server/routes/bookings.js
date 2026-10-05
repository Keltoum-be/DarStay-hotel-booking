import { Router } from "express"
import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import Room from "../models/Room.js"
import User from "../models/User.js"

const router = Router()

// POST /api/bookings  { roomId, checkInDate, checkOutDate, guests, user:{name,email} }
router.post("/", async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, guests, user } = req.body
    if (!roomId || !checkInDate || !checkOutDate || !user?.email)
      return res.status(400).json({ msg: "Champs manquants" })
    if (!mongoose.isValidObjectId(roomId)) return res.status(400).json({ msg: "roomId invalide" })

    const inD = new Date(checkInDate), outD = new Date(checkOutDate)
    if (isNaN(inD) || isNaN(outD) || outD <= inD)
      return res.status(400).json({ msg: "Dates invalides (départ après arrivée)" })

    const room = await Room.findById(roomId)
    if (!room) return res.status(404).json({ msg: "Chambre introuvable" })
    if (!room.isAvailable) return res.status(409).json({ msg: "Chambre indisponible" })

    const conflict = await Booking.exists({
      room: roomId,
      status: { $ne: "cancelled" },
      checkInDate: { $lt: outD },
      checkOutDate: { $gt: inD }
    })
    if (conflict) return res.status(409).json({ msg: "Chambre déjà réservée sur ces dates" })

    const dbUser = await User.findOneAndUpdate(
      { email: user.email },
      { $setOnInsert: { name: user.name } },
      { upsert: true, new: true }
    )
    const nights = Math.ceil((outD - inD) / 86400000)
    const booking = await Booking.create({
      user: dbUser._id,
      room: roomId,
      checkInDate: inD,
      checkOutDate: outD,
      guests: Number(guests) || 1,
      totalPrice: nights * room.pricePerNight
    })
    res.status(201).json(booking)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
})

// GET /api/bookings?email=...
router.get("/", async (req, res) => {
  try {
    const { email } = req.query
    if (!email) return res.status(400).json({ msg: "email requis" })
    const user = await User.findOne({ email })
    if (!user) return res.json([])
    const bookings = await Booking.find({ user: user._id }).populate("room").sort({ createdAt: -1 })
    res.json(bookings)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
})

export default router
