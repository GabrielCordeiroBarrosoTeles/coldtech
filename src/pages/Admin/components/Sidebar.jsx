import { Link, useLocation } from 'react-router-dom';

// Componentes de ícones simples
const IconComponent = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" style={{width: '1.5rem', height: '1.5rem'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const sidebarStyle = {
  backgroundColor: '#1f2937',
  color: 'white',
  width: '16rem',
  flexShrink: 0,
  height: '100%'
};

const headerStyle = {
  padding: '1rem'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold'
};

const navStyle = {
  marginTop: '1.5rem'
};

const linkBaseStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  color: '#d1d5db',
  textDecoration: 'none'
};

const linkActiveStyle = {
  backgroundColor: '#374151',
  color: 'white'
};

const iconContainerStyle = {
  marginRight: '0.75rem'
};

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: IconComponent, path: '/admin' },
    { name: 'Agendamentos', icon: IconComponent, path: '/admin/agendamentos' },
    { name: 'Clientes', icon: IconComponent, path: '/admin/clientes' },
    { name: 'Serviços', icon: IconComponent, path: '/admin/servicos' },
    { name: 'Configurações', icon: IconComponent, path: '/admin/configuracoes' },
  ];

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>ColdTech Admin</h2>
      </div>
      <nav style={navStyle}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const linkStyle = {
            ...linkBaseStyle,
            ...(isActive ? linkActiveStyle : {})
          };
          
          return (
            <Link
              key={item.name}
              to={item.path}
              style={linkStyle}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#374151';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={iconContainerStyle}>
                <item.icon />
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}