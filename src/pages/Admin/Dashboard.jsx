import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './admin.css';
import { AuthContext } from '../../contexts/AuthContext';
import authService from '../../services/simpleAuthService';

const dashboardStyle = {
  height: '100vh',
  display: 'flex',
  backgroundColor: '#f3f4f6'
};

const mainContentStyle = {
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const mainStyle = {
  flex: '1 1 0%',
  overflowX: 'hidden',
  overflowY: 'auto',
  backgroundColor: '#e5e7eb',
  padding: '1.5rem'
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Verificação adicional de segurança
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Se não houver usuário, não renderizar nada
  if (!user) {
    return null;
  }

  return (
    <div style={dashboardStyle}>
      <Sidebar />
      <div style={mainContentStyle}>
        <Navbar />
        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}