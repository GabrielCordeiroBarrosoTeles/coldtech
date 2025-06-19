import React, { useState, useEffect } from 'react';
import supabase from '../../../services/supabaseClient';

export default function ServicosAdmin() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('create'); // 'create' ou 'edit'
  const [currentServico, setCurrentServico] = useState({
    id: null,
    tipo: '',
    descricao: '',
    preco_base: ''
  });
  const [showForm, setShowForm] = useState(false);

  // Carregar serviços
  useEffect(() => {
    fetchServicos();
  }, []);

  // Buscar todos os serviços
  async function fetchServicos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('tipo');
      
      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      alert('Erro ao carregar serviços. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  }

  // Criar novo serviço
  async function handleCreate(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert([{
          tipo: currentServico.tipo,
          descricao: currentServico.descricao,
          preco_base: parseFloat(currentServico.preco_base)
        }])
        .select();
      
      if (error) throw error;
      
      setServicos([...servicos, data[0]]);
      resetForm();
      alert('Serviço criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      alert('Erro ao criar serviço. Verifique o console para mais detalhes.');
    }
  }

  // Atualizar serviço existente
  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('servicos')
        .update({
          tipo: currentServico.tipo,
          descricao: currentServico.descricao,
          preco_base: parseFloat(currentServico.preco_base)
        })
        .eq('id', currentServico.id)
        .select();
      
      if (error) throw error;
      
      setServicos(servicos.map(item => 
        item.id === currentServico.id ? data[0] : item
      ));
      resetForm();
      alert('Serviço atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      alert('Erro ao atualizar serviço. Verifique o console para mais detalhes.');
    }
  }

  // Excluir serviço
  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setServicos(servicos.filter(item => item.id !== id));
      alert('Serviço excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      alert('Erro ao excluir serviço. Verifique o console para mais detalhes.');
    }
  }

  // Preparar formulário para edição
  function handleEdit(servico) {
    setCurrentServico({
      id: servico.id,
      tipo: servico.tipo,
      descricao: servico.descricao,
      preco_base: servico.preco_base.toString()
    });
    setFormMode('edit');
    setShowForm(true);
  }

  // Resetar formulário
  function resetForm() {
    setCurrentServico({
      id: null,
      tipo: '',
      descricao: '',
      preco_base: ''
    });
    setFormMode('create');
    setShowForm(false);
  }

  // Manipular mudanças no formulário
  function handleChange(e) {
    const { name, value } = e.target;
    setCurrentServico({
      ...currentServico,
      [name]: value
    });
  }

  return (
    <div className="p-4">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333'}}>Gerenciamento de Serviços</h1>
        <button 
          onClick={() => {resetForm(); setShowForm(!showForm)}}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancelar' : 'Novo Serviço'}
        </button>
      </div>

      {/* Formulário de criação/edição */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>
            {formMode === 'create' ? 'Novo Serviço' : 'Editar Serviço'}
          </h2>
          
          <form onSubmit={formMode === 'create' ? handleCreate : handleUpdate}>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                Tipo de Serviço
              </label>
              <input
                type="text"
                name="tipo"
                value={currentServico.tipo}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
            
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                Descrição
              </label>
              <textarea
                name="descricao"
                value={currentServico.descricao}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  minHeight: '100px'
                }}
              />
            </div>
            
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                Preço Base (R$)
              </label>
              <input
                type="number"
                name="preco_base"
                value={currentServico.preco_base}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {formMode === 'create' ? 'Criar Serviço' : 'Atualizar Serviço'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de serviços */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{padding: '2rem', textAlign: 'center', color: '#6b7280'}}>
            Carregando serviços...
          </div>
        ) : servicos.length === 0 ? (
          <div style={{padding: '2rem', textAlign: 'center', color: '#6b7280'}}>
            Nenhum serviço cadastrado.
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: '#f9fafb'}}>
                  <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Tipo</th>
                  <th style={{padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Descrição</th>
                  <th style={{padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Preço Base</th>
                  <th style={{padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((servico, index) => (
                  <tr key={servico.id} style={{borderTop: '1px solid #e5e7eb', backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'}}>
                    <td style={{padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: '500'}}>{servico.tipo}</td>
                    <td style={{padding: '0.75rem 1.5rem', fontSize: '0.875rem', color: '#4b5563'}}>{servico.descricao || '-'}</td>
                    <td style={{padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', textAlign: 'right'}}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco_base)}
                    </td>
                    <td style={{padding: '0.75rem 1.5rem', textAlign: 'center'}}>
                      <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
                        <button
                          onClick={() => handleEdit(servico)}
                          style={{
                            backgroundColor: '#dbeafe',
                            color: '#3b82f6',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(servico.id)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
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
    </div>
  );
}