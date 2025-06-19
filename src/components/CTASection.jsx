import React from 'react';

function CTASection({ openModal }) {
  return (
    <section id="cta" className="cta-section" style={{
      marginTop: '0',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '3rem 2rem',
      color: 'white',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div className="container">
        <div className="cta-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            🚀 Precisa de Assistência Técnica Especializada?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            maxWidth: '800px',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Conte com a <strong>ColdTech</strong> para instalação, manutenção e projetos de climatização. Nossa equipe está pronta para oferecer soluções rápidas e eficientes para você ou sua empresa.
          </p>
          <button 
            className="cta-button principal large" 
            onClick={openModal}
            style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '50px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Solicitar Agendamento
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;