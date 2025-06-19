import React, { useState, useEffect } from 'react';
import databaseService from '../../../services/databaseService';

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState({
    nome: '',
    contato: '',
    endereco: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      setLoading(true);
      const data = await databaseService.getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente({
      ...currentCliente,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await databaseService.updateCliente(currentId, currentCliente);
        await loadClientes(); // Recarregar a lista após atualização
      } else {
        await databaseService.addCliente(currentCliente);
        await loadClientes(); // Recarregar a lista após adição
      }
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const handleEdit = (cliente) => {
    setCurrentCliente({
      nome: cliente.nome,
      contato: cliente.contato,
      endereco: cliente.endereco
    });
    setCurrentId(cliente.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await databaseService.deleteCliente(id);
        await loadClientes(); // Recarregar a lista após exclusão
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  const resetForm = () => {
    setCurrentCliente({
      nome: '',
      contato: '',
      endereco: ''
    });
    setIsEditing(false);
    setCurrentId(null);
    setShowModal(false);
  };

  return (
    <div>
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333'}}>Clientes</h1>
      
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600'}}>Lista de Clientes</h2>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Novo Cliente
          </button>
        </div>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '2rem 0'}}>
            <p>Carregando clientes...</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: '#f9fafb'}}>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Nome</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Contato</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Endereço</th>
                  <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Ações</th>
                </tr>
              </thead>
              <tbody style={{borderTop: '1px solid #e5e7eb'}}>
                {clientes.map((cliente, index) => (
                  <tr key={cliente.id} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>{cliente.nome}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{cliente.contato}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{cliente.endereco}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem'}}>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button 
                          onClick={() => handleEdit(cliente)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#eff6ff',
                            color: '#3b82f6',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(cliente.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button 
                onClick={resetForm}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={currentCliente.nome}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Contato
                </label>
                <input
                  type="text"
                  name="contato"
                  value={currentCliente.contato}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563'}}>
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={currentCliente.endereco}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}