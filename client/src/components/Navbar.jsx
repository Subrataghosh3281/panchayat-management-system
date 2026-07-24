import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#14532d',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' }}>
        Panchayat Portal
      </Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/citizen-login" style={{ color: 'white', textDecoration: 'none' }}>Citizen</Link>
        <Link to="/staff-login" style={{ color: 'white', textDecoration: 'none' }}>Staff</Link>
        <Link to="/admin-login" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
      </div>
    </div>
  )
}

export default Navbar