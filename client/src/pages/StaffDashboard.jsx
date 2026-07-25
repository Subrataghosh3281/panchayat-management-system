import { useState } from 'react'

const dummyQueue = [
  { id: 'CMP1001', citizen: 'Ramesh Kumar', location: 'Ward 4, Main Road', problem: 'Damaged street light', priority: 'High', confidence: '92%', status: 'Pending' },
  { id: 'CMP1005', citizen: 'Sita Devi', location: 'Ward 3, Temple Road', problem: 'Open manhole', priority: 'Critical', confidence: '97%', status: 'Pending' },
  { id: 'CMP1006', citizen: 'Anil Yadav', location: 'Ward 2, Market', problem: 'Garbage accumulation', priority: 'Medium', confidence: '81%', status: 'Pending' },
]

const priorityColors = {
  Critical: '#d9534f',
  High: '#f0ad4e',
  Medium: '#5bc0de',
  Low: '#5cb85c',
}

function StaffDashboard() {
  const [queue, setQueue] = useState(dummyQueue)

  const handleAction = (id, action) => {
    setQueue(prev => prev.map(item =>
      item.id === id ? { ...item, status: action } : item
    ))
  }

  const stats = {
    pending: queue.filter(q => q.status === 'Pending').length,
    accepted: queue.filter(q => q.status === 'Accepted').length,
    rejected: queue.filter(q => q.status === 'Rejected').length,
  }

  return (
    <div style={{ padding: '30px' }}>
      <header>
        <h2>Staff Dashboard</h2>
        <p>Welcome, Staff Member — Assigned to: Sample Panchayat</p>
      </header>

      {/* Stats */}
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

      <h3>Complaint Queue (CNN-Prioritized)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Citizen</th>
            <th style={{ padding: '10px' }}>Location</th>
            <th style={{ padding: '10px' }}>Problem</th>
            <th style={{ padding: '10px' }}>CNN Priority</th>
            <th style={{ padding: '10px' }}>Confidence</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{c.id}</td>
              <td style={{ padding: '10px' }}>{c.citizen}</td>
              <td style={{ padding: '10px' }}>{c.location}</td>
              <td style={{ padding: '10px' }}>{c.problem}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  color: 'white',
                  background: priorityColors[c.priority] || '#999',
                  fontSize: '0.85rem'
                }}>
                  {c.priority}
                </span>
              </td>
              <td style={{ padding: '10px' }}>{c.confidence}</td>
              <td style={{ padding: '10px' }}>{c.status}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => handleAction(c.id, 'Accepted')} style={{ marginRight: '6px', padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Accept
                </button>
                <button onClick={() => handleAction(c.id, 'Rejected')} style={{ padding: '6px 12px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StaffDashboard