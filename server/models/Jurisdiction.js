const mongoose = require('mongoose')

const jurisdictionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['District', 'Block', 'Panchayat', 'Village'],
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurisdiction',
    default: null,
  },
})

const Jurisdiction = mongoose.model('Jurisdiction', jurisdictionSchema)

module.exports = Jurisdiction