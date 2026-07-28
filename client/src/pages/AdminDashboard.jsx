import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5000/api'

function AdminDashboard() {
  const [search, setSearch] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Staff creation form state
  const [districts, setDistricts] = useState([])
  const [blocks, setBlocks] = useState([])
  const [panchayats, setPanchayats] = useState([])
  const [district, setDistrict] = useState('')
  const [block, setBlock] = useState('')
  const [panchayat, setPanchayat] = useState('')
  const [staffName, setStaffName] = useState('')
  const [staffContact, setStaffContact] = useState('')
  const [staffPassword, setStaffPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const dummyPanchayats = [
    { name: 'Sample Panchayat A', total: 42, completed: 30, pending: 12, rate: '71%' },
    { name: 'Sample Panchayat B', total: 25, completed: 10, pending: 15, rate: '40%' },
    { name: 'Sample Municipality C', total: 60, completed: 55, pending: 5, rate: '92%' },
  ]

  const dummyStaff = [
    { name: 'Ravi Sharma', panchayat: 'Sample Panchayat A', status: 'Active' },
    { name: 'Priya Singh', panchayat: 'Sample Panchayat B', status: 'Active' },
    { name: 'Mohan Das', panchayat: 'Sample Municipality C', status: 'Inactive' },
  ]

  const filteredPanchayats = dummyPanchayats.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // Load districts when the create form opens
  useEffect(() => {
    if (showCreateForm && districts.length === 0) {
      fetch(`${API_BASE}/jurisdictions/districts`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((err) => console.error('Failed to load districts:', err))
    }
  }, [showCreateForm])

  const handleDistrictChange = (e) => {
    const districtId = e.target.value
    setDistrict(districtId)
    setBlock('')
    setPanchayat('')
    setBlocks([])
    setPanchayats([])

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
    setPanchayats([])

    if (blockId) {
      fetch(`${API_BASE}/jurisdictions/panchayats/${blockId}`)
        .then((res) => res.json())
        .then((data) => setPanchayats(data))
        .catch((err) => console.error('Failed to load panchayats:', err))
    }
  }

  const handleCreateStaff = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${API_BASE}/auth/create-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: staffName,
          contact: staffContact,
          password: staffPassword,
          district,
          block,
          panchayat,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create staff')
        return
      }

      setMessage('Staff account created successfully!')
      setStaffName('')
      setStaffContact('')
      setStaffPassword('')
      setDistrict('')
      setBlock('')
      setPanchayat('')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div style={{ padding: '30px' }}>
      <header>
        <h2 style={{ color: '#1a1a1a' }}>Admin Dashboard</h2>
        <p>Manage staff accounts and view Panchayat/Municipality analytics.</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search Panchayat by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{ padding: '10px 20px', background: '#14532d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {showCreateForm ? 'Cancel' : '+ Create Staff'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', maxWidth: '500px' }}>
          <h3 style={{ color: '#1a1a1a' }}>Create New Staff Account</h3>

          {error && <p style={{ color: '#d9534f' }}>{error}</p>}
          {message && <p style={{ color: '#28a745' }}>{message}</p>}

          <form onSubmit={handleCreateStaff}>
            <div style={{ marginBottom: '12px' }}>
              <label>Staff Name</label><br />
              <input type="text" value={staffName} onChange={(e) => setStaffName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Contact / Login ID</label><br />
              <input type="text" value={staffContact} onChange={(e) => setStaffContact(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Initial Password</label><br />
              <input type="password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: '8px' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>District</label><br />
              <select value={district} onChange={handleDistrictChange} required style={{ width: '100%', padding: '8px' }}>
                <option value="">Select District</option>
                {districts.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Block</label><br />
              <select value={block} onChange={handleBlockChange} required disabled={!district} style={{ width: '100%', padding: '8px' }}>
                <option value="">Select Block</option>
                {blocks.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>Panchayat / Municipality</label><br />
              <select value={panchayat} onChange={(e) => setPanchayat(e.target.value)} required disabled={!block} style={{ width: '100%', padding: '8px' }}>
                <option value="">Select Panchayat</option>
                {panchayats.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <button type="submit" style={{ padding: '10px 20px', background: '#14532d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Create Staff
            </button>
          </form>
        </div>
      )}

      <h3 style={{ color: '#1a1a1a' }}>Panchayat / Municipality Analytics</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginBottom: '30px' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Total Applications</th>
            <th style={{ padding: '10px' }}>Completed</th>
            <th style={{ padding: '10px' }}>Pending</th>
            <th style={{ padding: '10px' }}>Completion Rate</th>
          </tr>
        </thead>
        <tbody>
          {filteredPanchayats.map((p) => (
            <tr key={p.name} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{p.name}</td>
              <td style={{ padding: '10px' }}>{p.total}</td>
              <td style={{ padding: '10px' }}>{p.completed}</td>
              <td style={{ padding: '10px' }}>{p.pending}</td>
              <td style={{ padding: '10px' }}>{p.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: '#1a1a1a' }}>Staff Enquiry</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Assigned Panchayat</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummyStaff.map((s) => (
            <tr key={s.name} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{s.name}</td>
              <td style={{ padding: '10px' }}>{s.panchayat}</td>
              <td style={{ padding: '10px' }}>{s.status}</td>
              <td style={{ padding: '10px' }}>
                <button style={{ padding: '6px 12px', background: '#0275d8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDashboard