import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext.jsx';

const headerStyle = {
  backgroundColor: 'white',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.5rem'
};

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#1f2937'
};

const userContainerStyle = {
  display: 'flex',
  alignItems: 'center'
};

const usernameStyle = {
  marginRight: '1rem',
  color: '#4b5563'
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  color: '#dc2626',
  borderRadius: '0.5rem',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer'
};

const buttonHoverStyle = {
  backgroundColor: '#fee2e2'
};

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Redireciona para a página de login após logout
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <h1 style={titleStyle}>Painel Administrativo</h1>
        </div>
        <div style={userContainerStyle}>
          <span style={usernameStyle}>{user?.name || 'Usuário'}</span>
          <button
            onClick={handleLogout}
            style={buttonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}