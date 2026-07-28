const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'staff', 'admin'],
    default: 'citizen',
  },
  rewardCoins: {
    type: Number,
    default: 0,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
  },
  block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
  },
  panchayat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
  },
}, {
  timestamps: true,
})

const User = mongoose.model('User', userSchema)

module.exports = User