import React from 'react';

function ServicesSection() {
  const services = [
    { icon: '📦', title: 'Instalação de Ar Condicionado', description: 'Realizamos a instalação de equipamentos com segurança e eficiência.' },
    { icon: '🔧', title: 'Manutenção Preventiva', description: 'Evite problemas futuros com manutenções regulares e programadas.' },
    { icon: '⚙️', title: 'Manutenção Corretiva', description: 'Reparos rápidos e eficazes para garantir o funcionamento do seu equipamento.' },
    { icon: '📋', title: 'Visitas Técnicas', description: 'Diagnóstico detalhado e soluções personalizadas para cada cliente.' },
    { icon: '❄️', title: 'Câmara Frigorífica', description: 'Projetos e manutenção de câmaras frigoríficas para diversas aplicações.' },
    { icon: '📐', title: 'Projetos', description: 'Desenvolvemos projetos personalizados para climatização de ambientes.' },
  ];

  return (
    <section id="servicos" className="servicos-section">
      <div className="container">
        <h2>Nossos Serviços</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {services.map((service, index) => (
            <div key={index} className="servico-item">
              <span className="icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;