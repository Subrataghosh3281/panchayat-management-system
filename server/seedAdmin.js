require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB Atlas.')

  const adminContact = process.env.ADMIN_CONTACT
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminContact || !adminPassword) {
    console.error('ADMIN_CONTACT and ADMIN_PASSWORD must be set in .env')
    process.exit(1)
  }

  const existingAdmin = await User.findOne({ contact: adminContact })
  if (existingAdmin) {
    console.log('An admin with this contact already exists. No changes made.')
    await mongoose.connection.close()
    process.exit(0)
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(adminPassword, salt)

  const admin = new User({
    name: 'System Administrator',
    contact: adminContact,
    password: hashedPassword,
    role: 'admin',
  })

  await admin.save()
  console.log('Admin account created successfully.')

  await mongoose.connection.close()
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})