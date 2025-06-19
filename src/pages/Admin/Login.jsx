import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar se já estiver logado
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Validação básica
      if (!credentials.email || !credentials.password) {
        setError('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }
      
      console.log('Tentando login com:', credentials.email, credentials.password);
      
      const success = await login(credentials);
      if (success) {
        console.log('Login bem-sucedido, redirecionando...');
        navigate('/admin');
      } else {
        console.log('Login falhou');
        setError('Usuário ou senha inválidos');
      }
    } catch (err) {
      console.error('Erro detalhado:', err);
      setError('Erro ao fazer login: ' + (err.message || 'Tente novamente.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #005A9C 0%, #007BFF 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: '#005A9C'}}>ColdTech</h1>
          <p style={{color: '#6B7280', marginTop: '0.5rem'}}>Manutenção de Ar Condicionado</p>
        </div>
        
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#005A9C',
          textAlign: 'center'
        }}>Acesso Administrativo</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1.25rem'}}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#4B5563'
            }}>E-mail</label>
            <input
              type="email"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #D1D5DB',
                fontSize: '1rem',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none'
              }}
              value={credentials.email}
              onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              required
              placeholder="admin@coldtech.com"
            />
          </div>
          
          <div style={{marginBottom: '1.25rem'}}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#4B5563'
            }}>Senha</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #D1D5DB',
                fontSize: '1rem',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none'
              }}
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>
          
          {error && <div style={{
            color: '#DC2626',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>{error}</div>}
          
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: isHovering ? '#004a80' : '#005A9C',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.7 : 1
            }}
            disabled={isLoading}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}