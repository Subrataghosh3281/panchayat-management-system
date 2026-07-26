const express = require('express')
const router = express.Router()
const Jurisdiction = require('../models/Jurisdiction')

// GET all Districts
router.get('/districts', async (req, res) => {
  try {
    const districts = await Jurisdiction.find({ type: 'District' }).sort({ name: 1 })
    res.json(districts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch districts' })
  }
})

// GET all Blocks under a given District
router.get('/blocks/:districtId', async (req, res) => {
  try {
    const blocks = await Jurisdiction.find({
      type: 'Block',
      parent: req.params.districtId,
    }).sort({ name: 1 })
    res.json(blocks)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blocks' })
  }
})

// GET all Panchayats under a given Block
router.get('/panchayats/:blockId', async (req, res) => {
  try {
    const panchayats = await Jurisdiction.find({
      type: 'Panchayat',
      parent: req.params.blockId,
    }).sort({ name: 1 })
    res.json(panchayats)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch panchayats' })
  }
})

// GET all Villages under a given Panchayat
router.get('/villages/:panchayatId', async (req, res) => {
  try {
    const villages = await Jurisdiction.find({
      type: 'Village',
      parent: req.params.panchayatId,
    }).sort({ name: 1 })
    res.json(villages)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch villages' })
  }
})

module.exports = router