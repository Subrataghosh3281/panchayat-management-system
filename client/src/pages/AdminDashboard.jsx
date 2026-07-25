import { useState } from 'react'

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

function AdminDashboard() {
  const [search, setSearch] = useState('')

  const filteredPanchayats = dummyPanchayats.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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
        <button style={{ padding: '10px 20px', background: '#14532d', color: 'white', border: 'none', borderRadius: '6px' }}>
          + Create Staff
        </button>
      </div>

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
          {filteredPanchayats.map(p => (
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
          {dummyStaff.map(s => (
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