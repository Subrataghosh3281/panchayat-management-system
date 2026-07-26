require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const jurisdictionRoutes = require('./routes/jurisdictionRoutes')

const app = express()
const PORT = 5000

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.get('/', (req, res) => {
  res.send('Panchayat Management System backend is running.')
})
app.use(express.json())
app.use('/api/jurisdictions', jurisdictionRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})