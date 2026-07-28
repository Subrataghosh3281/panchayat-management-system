const express = require('express')
const router = express.Router()
const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { verifyToken } = require('../middleware/authMiddleware')

const REWARD_COIN_AMOUNT = 20

function generateComplaintId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `CMP${randomNum}`
}

// POST a new complaint
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      citizenName, citizenContact, district, block, panchayat, village, landmark, description,
    } = req.body

    if (!citizenName || !citizenContact || !district || !block || !panchayat || !village || !landmark || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newComplaint = new Complaint({
      complaintId: generateComplaintId(),
      citizenId: req.user.userId,
      citizenName, citizenContact, district, block, panchayat, village, landmark, description,
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

// PATCH update a complaint's status (staff action) + reward crediting
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['Pending', 'Needs Information', 'Accepted', 'Sanctioned', 'Completed', 'Rejected']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' })
    }

    complaint.status = status

    // Credit reward coins exactly once, on first Accepted
    if (status === 'Accepted' && !complaint.rewardCredited) {
      await User.findByIdAndUpdate(complaint.citizenId, {
        $inc: { rewardCoins: REWARD_COIN_AMOUNT },
      })
      complaint.rewardCredited = true
    }

    await complaint.save()
    res.json(complaint)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update status' })
  }
})

// POST a message on a complaint (staff or citizen)
router.post('/:id/messages', verifyToken, async (req, res) => {
  try {
    const { text, sender } = req.body
    if (!text || !sender) {
      return res.status(400).json({ error: 'Missing message text or sender' })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' })
    }

    complaint.messages.push({ sender, text })
    await complaint.save()
    res.json(complaint)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add message' })
  }
})

module.exports = router