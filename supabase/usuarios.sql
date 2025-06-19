-- Tabela de usuários administradores
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,  -- Armazenará o hash bcrypt
  nome TEXT,
  ultimo_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir um usuário administrador padrão (senha: admin123)
-- Hash bcrypt gerado para 'admin123'
INSERT INTO usuarios (email, senha, nome) 
VALUES ('admin@coldtech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador');