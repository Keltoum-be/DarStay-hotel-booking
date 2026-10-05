import express from "express"
import Hotel from "../models/Hotel.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find()
    res.json(hotels)
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message })
  }
})

export default router