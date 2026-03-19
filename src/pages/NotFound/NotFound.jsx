import { Link } from 'react-router';

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '80px 20px' }}>
    <div style={{ fontSize: 64 }}>404</div>
    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0A0F1E', margin: '12px 0 8px' }}>
      Page not found
    </h2>
    <p style={{ color: 'rgba(10,15,30,0.50)', marginBottom: 24 }}>
      The page you're looking for doesn't exist.
    </p>
    <Link to="/" style={{
      background: '#0B3D91', color: '#fff', padding: '10px 24px',
      borderRadius: 100, textDecoration: 'none', fontWeight: 700, fontSize: 14
    }}>
      Go home
    </Link>
  </div>
);

export default NotFound;