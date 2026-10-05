import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email
})

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "name, email and password are required" })
    }
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ msg: "Email already used" })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    res.status(201).json(publicUser(user)) // ✅ sans le mot de passe
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ msg: "User not found" })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ msg: "Wrong password" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })
    res.json({ token, user: publicUser(user) })
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message })
  }
})

export default router