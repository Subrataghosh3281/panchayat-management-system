import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:5000/api'

const statusColors = {
  'Pending': '#f0ad4e',
  'Needs Information': '#5bc0de',
  'Accepted': '#0275d8',
  'Sanctioned': '#5cb85c',
  'Completed': '#28a745',
  'Rejected': '#d9534f',
}

function CitizenDashboard() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [complaints, setComplaints] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))

    const token = localStorage.getItem('token')
    fetch(`${API_BASE}/complaints/my-complaints`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComplaints(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load complaints:', err))
  }, [])

  const filteredComplaints = filter === 'All'
    ? complaints
    : complaints.filter((c) => c.status === filter)

  const statuses = ['All', 'Pending', 'Needs Information', 'Accepted', 'Sanctioned', 'Completed', 'Rejected']

  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      <aside style={{ width: '220px', background: '#f4f6f8', padding: '20px', borderRight: '1px solid #ddd' }}>
        <h3>My Profile</h3>
        <p>Name: {user?.name || '...'}</p>
        <p>Contact: {user?.contact || '...'}</p>
        <button style={{ marginTop: '10px', padding: '8px 16px' }}>Edit Profile</button>
      </aside>

      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Complaints</h2>
          <button onClick={() => navigate('/new-complaint')} style={{ padding: '10px 20px', background: '#14532d', color: 'white', border: 'none', borderRadius: '6px' }}>
            + New Application
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: filter === s ? '2px solid #14532d' : '1px solid #ccc',
                background: filter === s ? '#e6f0ea' : 'white',
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {filteredComplaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Location</th>
                <th style={{ padding: '10px' }}>Problem</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{c.complaintId}</td>
                  <td style={{ padding: '10px' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '10px' }}>{c.village?.name}, {c.panchayat?.name}</td>
                  <td style={{ padding: '10px' }}>{c.description}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      color: 'white',
                      background: statusColors[c.status] || '#999',
                      fontSize: '0.85rem'
                    }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}

export default CitizenDashboard