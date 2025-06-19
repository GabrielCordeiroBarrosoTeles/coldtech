-- Tabela de serviços
CREATE TABLE servicos (
  id SERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  descricao TEXT,
  preco_base DECIMAL(10,2) NOT NULL
);

-- Tabela de clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  contato TEXT,
  endereco TEXT
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  servico_id INTEGER REFERENCES servicos(id),
  data DATE NOT NULL,
  time TIME NOT NULL,
  local TEXT NOT NULL,
  preco DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais de serviços
INSERT INTO servicos (tipo, descricao, preco_base) VALUES
('manutenção preventiva', 'Verificação e manutenção periódica para prevenir problemas', 150.00),
('manutenção corretiva', 'Reparo de equipamentos com defeito', 200.00),
('instalação de maquina', 'Instalação e configuração de novos equipamentos', 250.00),
('outros', 'Outros serviços personalizados', 100.00);