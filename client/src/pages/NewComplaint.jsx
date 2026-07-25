import { useState } from 'react'

// Dummy hierarchical location data (later this will come from the database)
const locationData = {
  'District A': {
    'Block 1': ['Village X', 'Village Y'],
    'Block 2': ['Village Z'],
  },
  'District B': {
    'Block 3': ['Village M', 'Village N'],
  },
}

function NewComplaint() {
  const [district, setDistrict] = useState('')
  const [block, setBlock] = useState('')
  const [village, setVillage] = useState('')
  const [landmark, setLandmark] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const districts = Object.keys(locationData)
  const blocks = district ? Object.keys(locationData[district]) : []
  const villages = district && block ? locationData[district][block] : []

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value)
    setBlock('')
    setVillage('')
  }

  const handleBlockChange = (e) => {
    setBlock(e.target.value)
    setVillage('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setImage(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ padding: '30px' }}>
        <h2 style={{ color: '#14532d' }}>Complaint Submitted!</h2>
        <p>Your complaint ID is <strong>CMP{Math.floor(1000 + Math.random() * 9000)}</strong>.</p>
        <p>You can track its status in your Citizen Dashboard.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px' }}>
      <h2 style={{ color: '#1a1a1a' }}>Submit a New Complaint</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>District</label><br />
          <select value={district} onChange={handleDistrictChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Select District</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Block</label><br />
          <select value={block} onChange={handleBlockChange} required disabled={!district} style={{ width: '100%', padding: '8px' }}>
            <option value="">Select Block</option>
            {blocks.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Village / Locality</label><br />
          <select value={village} onChange={(e) => setVillage(e.target.value)} required disabled={!block} style={{ width: '100%', padding: '8px' }}>
            <option value="">Select Village</option>
            {villages.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Landmark / Exact Location</label><br />
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Near government school"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Problem Description</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Upload Image</label><br />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <div style={{ marginTop: '10px' }}>
              <img src={image} alt="preview" style={{ maxWidth: '200px', borderRadius: '6px' }} />
            </div>
          )}
        </div>

        <button type="submit" style={{ padding: '12px 24px', background: '#14532d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Submit Complaint
        </button>
      </form>
    </div>
  )
}

export default NewComplaint