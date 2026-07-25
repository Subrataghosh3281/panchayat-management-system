import { useState } from 'react'

const dummyComplaints = [
  { id: 'CMP1001', date: '2026-07-20', location: 'Ward 4, Main Road', problem: 'Damaged street light', status: 'Pending' },
  { id: 'CMP1002', date: '2026-07-18', location: 'Ward 2, Near School', problem: 'Open manhole', status: 'Accepted' },
  { id: 'CMP1003', date: '2026-07-10', location: 'Ward 4, Market Area', problem: 'Garbage accumulation', status: 'Completed' },
  { id: 'CMP1004', date: '2026-07-05', location: 'Ward 1, Bus Stand', problem: 'Broken drainage', status: 'Needs Information' },
]

const statusColors = {
  'Pending': '#f0ad4e',
  'Needs Information': '#5bc0de',
  'Accepted': '#0275d8',
  'Sanctioned': '#5cb85c',
  'Completed': '#28a745',
  'Rejected': '#d9534f',
}

function CitizenDashboard() {
  const [filter, setFilter] = useState('All')

  const filteredComplaints = filter === 'All'
    ? dummyComplaints
    : dummyComplaints.filter(c => c.status === filter)

  const statuses = ['All', 'Pending', 'Needs Information', 'Accepted', 'Sanctioned', 'Completed', 'Rejected']

  return (
    <div style={{ display: 'flex', minHeight: '80vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: '#f4f6f8', padding: '20px', borderRight: '1px solid #ddd' }}>
        <h3>My Profile</h3>
        <p>Name: Ramesh Kumar</p>
        <p>Mobile: 98XXXXXX21</p>
        <p>District: Sample District</p>
        <p>Block: Sample Block</p>
        <button style={{ marginTop: '10px', padding: '8px 16px' }}>Edit Profile</button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Complaints</h2>
          <button style={{ padding: '10px 20px', background: '#14532d', color: 'white', border: 'none', borderRadius: '6px' }}>
            + New Application
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
          {statuses.map(s => (
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

        {/* Complaint list */}
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
            {filteredComplaints.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{c.id}</td>
                <td style={{ padding: '10px' }}>{c.date}</td>
                <td style={{ padding: '10px' }}>{c.location}</td>
                <td style={{ padding: '10px' }}>{c.problem}</td>
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
      </main>
    </div>
  )
}

export default CitizenDashboard