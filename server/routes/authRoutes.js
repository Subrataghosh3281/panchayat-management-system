const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { verifyToken, requireRole } = require('../middleware/authMiddleware')

// POST - Register a new citizen
router.post('/register', async (req, res) => {
  try {
    const { name, contact, password } = req.body

    if (!name || !contact || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if a user with this contact already exists
    const existingUser = await User.findOne({ contact })
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this contact already exists' })
    }

    // Hash the password before saving (never store plain text)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      contact,
      password: hashedPassword,
      role: 'citizen',
    })

    await newUser.save()

    res.status(201).json({ message: 'Registration successful. Please log in.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// POST - Login
router.post('/login', async (req, res) => {
  try {
    const { contact, password } = req.body

    if (!contact || !password) {
      return res.status(400).json({ error: 'Missing contact or password' })
    }

    const user = await User.findOne({ contact })
    if (!user) {
      return res.status(401).json({ error: 'Invalid contact or password' })
    }

    // Compare the typed password against the stored hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid contact or password' })
    }

    // Create a JWT token containing the user's ID and role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        contact: user.contact,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})
// POST - Admin creates a Staff account
router.post('/create-staff', verifyToken,requireRole('admin'),async (req, res) => {
  try {
    const { name, contact, password, district, block, panchayat } = req.body


    if (!name || !contact || !password || !district || !block || !panchayat) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const existingUser = await User.findOne({ contact })
    if(existingUser) {
      return res.status(400).json({ error: 'An account with this contact already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newStaff = new User({
      name,
      contact,
      password: hashedPassword,
      role: 'staff',
      district,
      block,
      panchayat,
    })

    await newStaff.save()

    res.status(201).json({ message: 'Staff account created successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create staff account' })
  }
})
module.exports = router