import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = ({ openModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleLinkClick = (path) => {
    if (path === '/contato' && openModal) {
      openModal();
    } else {
      navigate(path);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    },
    
    floatingElement: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: 'float 3s ease-in-out infinite',
      pointerEvents: 'none'
    },

    mainContent: {
      textAlign: 'center',
      zIndex: 10,
      transition: 'all 1s ease-out',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
    },

    logoContainer: {
      marginBottom: '2rem'
    },

    logoIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    },

    errorNumber: {
      position: 'relative',
      marginBottom: '1.5rem'
    },

    errorText: {
      fontSize: 'clamp(4rem, 15vw, 8rem)',
      fontWeight: '900',
      color: 'white',
      opacity: 0.9,
      userSelect: 'none',
      textShadow: '2px 2px 0 rgba(255, 255, 255, 0.2)'
    },

    errorShadow: {
      position: 'absolute',
      top: '4px',
      left: '4px',
      fontSize: 'clamp(4rem, 15vw, 8rem)',
      fontWeight: '900',
      color: 'rgba(255, 255, 255, 0.2)',
      zIndex: -1,
      userSelect: 'none'
    },

    titleSection: {
      marginBottom: '2rem'
    },

    title: {
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1rem',
      letterSpacing: '-0.025em'
    },

    description: {
      fontSize: '1.125rem',
      color: 'rgba(191, 219, 254, 1)',
      maxWidth: '28rem',
      margin: '0 auto',
      lineHeight: 1.6
    },

    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '2rem'
    },

    primaryButton: {
      background: 'white',
      color: '#1d4ed8',
      padding: '1rem 2rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      fontSize: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },

    secondaryButton: {
      background: 'transparent',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      fontSize: '1rem'
    },

    contactSection: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '2rem'
    },

    contactHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    },

    contactTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'white',
      marginLeft: '0.75rem'
    },

    contactDescription: {
      color: 'rgba(191, 219, 254, 1)',
      marginBottom: '1.5rem',
      fontSize: '0.875rem'
    },

    contactButton: {
      background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.5rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '0 auto',
      transition: 'all 0.2s ease'
    },

    linksSection: {
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)'
    },

    linksTitle: {
      color: 'rgba(191, 219, 254, 1)',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    },

    linksContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '1.5rem',
      fontSize: '0.875rem'
    },

    link: {
      color: 'rgba(191, 219, 254, 1)',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },

    footer: {
      marginTop: '2rem',
      fontSize: '0.75rem',
      color: 'rgba(191, 219, 254, 0.75)'
    },

    decorationTop: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '8rem',
      height: '8rem',
      background: 'linear-gradient(to bottom left, rgba(255, 255, 255, 0.05), transparent)',
      borderRadius: '50%',
      transform: 'translate(4rem, -4rem)'
    },

    decorationBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '10rem',
      height: '10rem',
      background: 'linear-gradient(to top right, rgba(255, 255, 255, 0.05), transparent)',
      borderRadius: '50%',
      transform: 'translate(-5rem, 5rem)'
    }
  };

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @media (min-width: 640px) {
        .button-container-responsive {
          flex-direction: row !important;
        }
      }
      
      .primary-button:hover {
        transform: scale(1.05);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }
      
      .secondary-button:hover {
        border-color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.1);
      }
      
      .contact-button:hover {
        background: linear-gradient(to right, #2563eb, #3b82f6);
      }
      
      .link:hover {
        color: white;
        text-decoration: underline;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const floatingElements = [
    { size: 8, top: '20%', left: '10%', delay: '0s' },
    { size: 12, top: '40%', left: '20%', delay: '0.5s' },
    { size: 6, top: '60%', left: '30%', delay: '1s' },
    { size: 10, top: '80%', left: '40%', delay: '1.5s' },
    { size: 8, top: '30%', right: '15%', delay: '2s' },
    { size: 14, top: '70%', right: '25%', delay: '2.5s' },
    { size: 4, top: '10%', left: '50%', delay: '3s' },
    { size: 9, top: '90%', right: '10%', delay: '3.5s' }
  ];

  return (
    <div style={styles.container}>
      {floatingElements.map((element, index) => (
        <div
          key={index}
          style={{
            ...styles.floatingElement,
            width: `${element.size}px`,
            height: `${element.size}px`,
            top: element.top,
            left: element.left,
            right: element.right,
            animationDelay: element.delay
          }}
        />
      ))}

      <div style={styles.mainContent}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div style={styles.errorNumber}>
          <h1 style={styles.errorText}>404</h1>
          <div style={styles.errorShadow}>404</div>
        </div>

        <div style={styles.titleSection}>
          <h2 style={styles.title}>Página não encontrada</h2>
          <p style={styles.description}>
            A página que você procura não existe ou foi movida. Nossa equipe está pronta para ajudá-lo.
          </p>
        </div>

        <div style={{...styles.buttonContainer}} className="button-container-responsive">
          <button 
            onClick={handleGoHome}
            style={styles.primaryButton}
            className="primary-button"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Voltar ao Início
          </button>
          
          <button 
            onClick={handleGoBack}
            style={styles.secondaryButton}
            className="secondary-button"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Página Anterior
          </button>
        </div>

        <div style={styles.contactSection}>
          <div style={styles.contactHeader}>
            <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 style={styles.contactTitle}>Precisa de Assistência Técnica?</h3>
          </div>
          
          <p style={styles.contactDescription}>
            Nossa equipe especializada está pronta para atendê-lo com soluções rápidas e eficientes.
          </p>

          <button 
            onClick={() => handleLinkClick('/contato')}
            style={styles.contactButton}
            className="contact-button"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Solicitar Agendamento
          </button>
        </div>

        <div style={styles.linksSection}>
          <p style={styles.linksTitle}>Explore nossos serviços:</p>
          <div style={styles.linksContainer}>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} 
              style={{...styles.link, background: 'none', border: 'none'}}
              className="link"
            >
              Nossos Serviços
            </button>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} 
              style={{...styles.link, background: 'none', border: 'none'}}
              className="link"
            >
              Contato
            </button>
            <button 
              onClick={() => navigate('/login')} 
              style={{...styles.link, background: 'none', border: 'none'}}
              className="link"
            >
              Área Restrita
            </button>
          </div>
        </div>

        <div style={styles.footer}>
          © ColdTech - Especialistas em ar-condicionado
        </div>
      </div>

      <div style={styles.decorationTop}></div>
      <div style={styles.decorationBottom}></div>
    </div>
  );
};

export default NotFoundPage;