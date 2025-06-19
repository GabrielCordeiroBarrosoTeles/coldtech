import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';


function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleAnchorClick = (e, target) => {
    e.preventDefault();
    window.location.href = '/' + target;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <img src="../src/assets/logo.svg" alt="ColdTech Logo" />
          <span className="logo-text">ColdTech</span>
        </Link>
        <ul className="navbar-links">
          {isHomePage ? (
            <>
              <li><a href="#servicos">Serviços</a></li>
              <li><a href="#cta">Contato</a></li>
              <li>
              <Link to="/login">
              <Lock size={16} style={{ marginRight: 6 }} />
              Área Restrita
              </Link>
              </li>
            </>
          ) : (
            <>
              <li><a href="#" onClick={(e) => handleAnchorClick(e, '#servicos')}>Serviços</a></li>
              <li><a href="#" onClick={(e) => handleAnchorClick(e, '#cta')}>Contato</a></li>
              <li><Link to="/agenda">Agenda</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;