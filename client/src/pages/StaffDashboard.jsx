import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5000/api'

const priorityColors = {
  Critical: '#d9534f',
  High: '#f0ad4e',
  Medium: '#5bc0de',
  Low: '#5cb85c',
}

function StaffDashboard() {
  const [queue, setQueue] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
    loadQueue()
  }, [])

  const loadQueue = () => {
    const token = localStorage.getItem('token')
    fetch(`${API_BASE}/complaints/staff-queue`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setQueue(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load queue:', err))
  }

  const handleAction = async (id, newStatus) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        setQueue((prev) => prev.map((item) => item._id === id ? { ...item, status: newStatus } : item))
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const stats = {
    pending: queue.filter((q) => q.status === 'Pending').length,
    accepted: queue.filter((q) => q.status === 'Accepted').length,
    rejected: queue.filter((q) => q.status === 'Rejected').length,
  }

  return (
    <div style={{ padding: '30px' }}>
      <header>
        <h2 style={{ color: '#1a1a1a' }}>Staff Dashboard</h2>
        <p>Welcome, {user?.name || 'Staff Member'}</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div style={{ padding: '15px 25px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <strong>{stats.pending}</strong> Pending
        </div>
        <div style={{ padding: '15px 25px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <strong>{stats.accepted}</strong> Accepted
        </div>
        <div style={{ padding: '15px 25px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <strong>{stats.rejected}</strong> Rejected
        </div>
      </div>

      <h3 style={{ color: '#1a1a1a' }}>Complaint Queue</h3>
      {queue.length === 0 ? (
        <p>No complaints assigned to your jurisdiction yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Citizen</th>
              <th style={{ padding: '10px' }}>Location</th>
              <th style={{ padding: '10px' }}>Problem</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((c) => (
              <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{c.complaintId}</td>
                <td style={{ padding: '10px' }}>{c.citizenName}</td>
                <td style={{ padding: '10px' }}>{c.village?.name}</td>
                <td style={{ padding: '10px' }}>{c.description}</td>
                <td style={{ padding: '10px' }}>{c.status}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleAction(c._id, 'Accepted')} style={{ marginRight: '6px', padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Accept
                  </button>
                  <button onClick={() => handleAction(c._id, 'Rejected')} style={{ marginRight: '6px', padding: '6px 12px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Reject
                  </button>
                  <button onClick={() => handleAction(c._id, 'Completed')} style={{ padding: '6px 12px', background: '#0275d8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default StaffDashboard