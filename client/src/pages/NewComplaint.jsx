import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5000/api'

function NewComplaint() {
  const [districts, setDistricts] = useState([])
  const [blocks, setBlocks] = useState([])
  const [panchayats, setPanchayats] = useState([])
  const [villages, setVillages] = useState([])

  const [district, setDistrict] = useState('')
  const [block, setBlock] = useState('')
  const [panchayat, setPanchayat] = useState('')
  const [village, setVillage] = useState('')

  const [citizenName, setCitizenName] = useState('')
  const [citizenContact, setCitizenContact] = useState('')
  const [landmark, setLandmark] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)

  const [submitted, setSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/jurisdictions/districts`)
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error('Failed to load districts:', err))
  }, [])

  const handleDistrictChange = (e) => {
    const districtId = e.target.value
    setDistrict(districtId)
    setBlock('')
    setPanchayat('')
    setVillage('')
    setBlocks([])
    setPanchayats([])
    setVillages([])

    if (districtId) {
      fetch(`${API_BASE}/jurisdictions/blocks/${districtId}`)
        .then((res) => res.json())
        .then((data) => setBlocks(data))
        .catch((err) => console.error('Failed to load blocks:', err))
    }
  }

  const handleBlockChange = (e) => {
    const blockId = e.target.value
    setBlock(blockId)
    setPanchayat('')
    setVillage('')
    setPanchayats([])
    setVillages([])

    if (blockId) {
      fetch(`${API_BASE}/jurisdictions/panchayats/${blockId}`)
        .then((res) => res.json())
        .then((data) => setPanchayats(data))
        .catch((err) => console.error('Failed to load panchayats:', err))
    }
  }

  const handlePanchayatChange = (e) => {
    const panchayatId = e.target.value
    setPanchayat(panchayatId)
    setVillage('')
    setVillages([])

    if (panchayatId) {
      fetch(`${API_BASE}/jurisdictions/villages/${panchayatId}`)
        .then((res) => res.json())
        .then((data) => setVillages(data))
        .catch((err) => console.error('Failed to load villages:', err))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          citizenName,
          citizenContact,
          district,
          block,
          panchayat,
          village,
          landmark,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit complaint')
      }

      const data = await response.json()
      setSubmittedId(data.complaintId)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong while submitting. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div style={{ padding: '30px' }}>
        <h2 style={{ color: '#14532d' }}>Complaint Submitted!</h2>
        <p>Your complaint ID is <strong>{submittedId}</strong>.</p>
        <p>You can track its status in your Citizen Dashboard.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px' }}>
      <h2 style={{ color: '#1a1a1a' }}>Submit a New Complaint</h2>

      {error && <p style={{ color: '#d9534f' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Your Name</label><br />
          <input
            type="text"
            value={citizenName}
            onChange={(e) => setCitizenName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contact Number</label><br />
          <input
            type="text"
            value={citizenContact}
            onChange={(e) => setCitizenContact(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>District</label><br />
          <select value={district} onChange={handleDistrictChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Select District</option>
            {districts.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Block</label><br />
          <select value={block} onChange={handleBlockChange} required disabled={!district} style={{ width: '100%', padding: '8px' }}>
            <option value="">Select Block</option>
            {blocks.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Panchayat / Municipality</label><br />
          <select value={panchayat} onChange={handlePanchayatChange} required disabled={!block} style={{ width: '100%', padding: '8px' }}>
            <option value="">Select Panchayat</option>
            {panchayats.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Village / Locality</label><br />
          <select value={village} onChange={(e) => setVillage(e.target.value)} required disabled={!panchayat} style={{ width: '100%', padding: '8px' }}>
            <option value="">Select Village</option>
            {villages.map((v) => <option key={v._id} value={v._id}>{v.name}</option>)}
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