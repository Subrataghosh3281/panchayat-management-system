const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
  },
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  citizenName: {
    type: String,
    required: true,
  },
  citizenContact: {
    type: String,
    required: true,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    required: true,
  },
  block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    required: true,
  },
  panchayat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    required: true,
  },
  village: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'Needs Information', 'Accepted', 'Sanctioned', 'Completed', 'Rejected'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical', null],
    default: null,
  },
  messages: [
    {
      sender: { type: String, enum: ['staff', 'citizen'], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  rewardCredited: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

const Complaint = mongoose.model('Complaint', complaintSchema)

module.exports = Complaint