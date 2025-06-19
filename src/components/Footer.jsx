import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <p>
          © <span id="current-year"></span> ColdTech - Todos os direitos reservados.
        </p>
        <p>
          <a href="/termos">Termos de Uso</a> | <a href="/privacidade">Política de Privacidade</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;