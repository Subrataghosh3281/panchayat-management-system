const express = require('express')
const router = express.Router()
const Complaint = require('../models/Complaint')

// Helper function: generate a unique complaint ID like "CMP1023"
function generateComplaintId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `CMP${randomNum}`
}

// POST a new complaint
router.post('/', async (req, res) => {
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

    // Basic validation: make sure required fields are present
    if (!citizenName || !citizenContact || !district || !block || !panchayat || !village || !landmark || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newComplaint = new Complaint({
      complaintId: generateComplaintId(),
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

module.exports = router