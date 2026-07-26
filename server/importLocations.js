require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Jurisdiction = require('./models/Jurisdiction')

async function importData() {
  // Step 1: Connect to the database
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB Atlas.')

  // Step 2: Read the JSON file from disk
  const rawData = fs.readFileSync(path.join(__dirname, 'data', 'locationData.json'))
  const districts = JSON.parse(rawData)

  // Step 3: Clear any old data first (so re-running this script doesn't create duplicates)
  await Jurisdiction.deleteMany({})
  console.log('Cleared old jurisdiction data.')

  let districtCount = 0
  let blockCount = 0
  let panchayatCount = 0
  let villageCount = 0

  // Step 4: Loop through each district
  for (const districtData of districts) {
    const district = await Jurisdiction.create({
      name: districtData.district,
      type: 'District',
      parent: null,
    })
    districtCount++

    // Step 5: Loop through each block inside this district
    for (const blockData of districtData.blocks) {
      const block = await Jurisdiction.create({
        name: blockData.name,
        type: 'Block',
        parent: district._id,
      })
      blockCount++

      // Step 6: Loop through each panchayat inside this block
      for (const panchayatData of blockData.panchayats) {
        const panchayat = await Jurisdiction.create({
          name: panchayatData.name,
          type: 'Panchayat',
          parent: block._id,
        })
        panchayatCount++

        // Step 7: Loop through each village inside this panchayat
        for (const villageName of panchayatData.villages) {
          await Jurisdiction.create({
            name: villageName,
            type: 'Village',
            parent: panchayat._id,
          })
          villageCount++
        }
      }
    }

    console.log(`Processed district: ${districtData.district}`)
  }

  console.log('--- Import complete ---')
  console.log(`Districts: ${districtCount}`)
  console.log(`Blocks: ${blockCount}`)
  console.log(`Panchayats: ${panchayatCount}`)
  console.log(`Villages: ${villageCount}`)

  // Step 8: Close the connection
  await mongoose.connection.close()
  process.exit(0)
}

importData().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})