const express = require('express')
const router = express.Router()
const Complaint = require('../models/Complaint')
const { verifyToken } = require('../middleware/authMiddleware')

function generateComplaintId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `CMP${randomNum}`
}

// POST a new complaint (must be logged in as citizen)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      citizenName,
      citizenContact,
      district,
      block,
      panchayat,
      village,
      landmark,
      description,
    } = req.body

    if (!citizenName || !citizenContact || !district || !block || !panchayat || !village || !landmark || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newComplaint = new Complaint({
      complaintId: generateComplaintId(),
      citizenId: req.user.userId,
      citizenName,
      citizenContact,
      district,
      block,
      panchayat,
      village,
      landmark,
      description,
    })

    const savedComplaint = await newComplaint.save()
    res.status(201).json(savedComplaint)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to submit complaint' })
  }
})

// GET complaints belonging to the logged-in citizen
router.get('/my-complaints', verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizenId: req.user.userId })
      .populate('district block panchayat village', 'name')
      .sort({ createdAt: -1 })
    res.json(complaints)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch complaints' })
  }
})

// GET complaints for staff's assigned panchayat
router.get('/staff-queue', verifyToken, async (req, res) => {
  try {
    const User = require('../models/User')
    const staffUser = await User.findById(req.user.userId)
    if (!staffUser || !staffUser.panchayat) {
      return res.status(400).json({ error: 'Staff account has no assigned panchayat' })
    }

    const complaints = await Complaint.find({ panchayat: staffUser.panchayat })
      .populate('district block panchayat village', 'name')
      .sort({ createdAt: -1 })
    res.json(complaints)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch staff queue' })
  }
})

// PATCH update a complaint's status (staff action)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['Pending', 'Needs Information', 'Accepted', 'Sanctioned', 'Completed', 'Rejected']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' })
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' })
    }

    res.json(complaint)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update status' })
  }
})

module.exports = router