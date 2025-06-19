import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';

function SchedulingModal({ closeModal }) {
  const [formData, setFormData] = useState({
    cliente: '',
    contato: '',
    servico: 'manutenção preventiva',
    data: '',
    time: '',
    local: '',
    status: 'pendente'
  });
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isCheckingTimes, setIsCheckingTimes] = useState(false);

  const allTimeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const loadServicos = async () => {
      const servicosData = await databaseService.getServicos();
      setServicos(servicosData);
    };
    
    loadServicos();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      data: tomorrowStr
    }));
  }, []);

  useEffect(() => {
    if (formData.data) {
      checkAvailableTimes(formData.data);
    }
  }, [formData.data]);

  const checkAvailableTimes = async (date) => {
    setIsCheckingTimes(true);
    setError('');
    
    try {
      setFormData(prev => ({
        ...prev,
        time: ''
      }));
      
      const agendamentos = await databaseService.getAgendamentosByDate(date);
      const ocupados = agendamentos.map(agendamento => {
        let time = agendamento.time;
        if (time.includes(':')) {
          const parts = time.split(':');
          if (parts.length >= 2) {
            time = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
          }
        }
        return time;
      });
      
      const disponíveis = allTimeSlots.filter(time => !ocupados.includes(time));
      setAvailableTimes(disponíveis);
      
      if (disponíveis.length === 0) {
        setError(`Não há horários disponíveis para ${date}. Por favor, selecione outra data.`);
      }
    } catch (err) {
      setError('Erro ao verificar horários disponíveis. Tente novamente.');
    } finally {
      setIsCheckingTimes(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'data') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        time: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.cliente || !formData.contato || !formData.data || !formData.time || !formData.local) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }
      
      const currentAgendamentos = await databaseService.getAgendamentosByDate(formData.data);
      const currentBusyTimes = currentAgendamentos.map(a => a.time);
      
      if (currentBusyTimes.includes(formData.time)) {
        throw new Error('Este horário não está mais disponível. Por favor, selecione outro horário.');
      }
      
      await databaseService.addAgendamento(formData);
      
      setSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao agendar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '90%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button 
          onClick={closeModal} 
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e5e7eb';
            e.target.style.color = '#374151';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#6b7280';
          }}
        >
          ×
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <svg width="24" height="24" fill="#2563eb" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>
            Solicitar Agendamento
          </h2>
          <p style={{
            color: '#6b7280',
            marginTop: '0.5rem',
            fontSize: '1rem'
          }}>
            Preencha os dados para agendar seu atendimento
          </p>
        </div>
        
        {success ? (
          <div style={{
            padding: '2rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Agendamento Solicitado!</h3>
            <p style={{ color: '#15803d' }}>Nossa equipe entrará em contato para confirmar.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                color: '#dc2626',
                border: '1px solid #fecaca',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Nome Completo *
              </label>
              <input 
                type="text" 
                name="cliente" 
                value={formData.cliente}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Telefone/WhatsApp *
              </label>
              <input 
                type="tel" 
                name="contato" 
                value={formData.contato}
                onChange={handleChange}
                required
                placeholder="(00) 00000-0000"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Tipo de Serviço *
              </label>
              <select 
                name="servico" 
                value={formData.servico}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                {servicos.map(servico => (
                  <option key={servico.id} value={servico.tipo}>
                    {servico.tipo}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  Data Desejada *
                </label>
                <input 
                  type="date" 
                  name="data" 
                  value={formData.data}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.9rem'
                }}>
                  Horário *
                </label>
                <select 
                  name="time" 
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={isCheckingTimes || availableTimes.length === 0}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    opacity: isCheckingTimes ? 0.7 : 1,
                    outline: 'none'
                  }}
                >
                  <option value="">Selecione</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.9rem'
              }}>
                Endereço Completo *
              </label>
              <textarea 
                name="local" 
                value={formData.local}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Rua, número, bairro, cidade"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  backgroundColor: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#d1d5db';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                disabled={loading || isCheckingTimes || availableTimes.length === 0 || !formData.time}
                style={{
                  flex: 2,
                  padding: '0.875rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (loading || isCheckingTimes || availableTimes.length === 0 || !formData.time) ? 'not-allowed' : 'pointer',
                  opacity: (loading || isCheckingTimes || availableTimes.length === 0 || !formData.time) ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseOut={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = '#2563eb';
                  }
                }}
              >
                {loading ? 'Enviando...' : 'Solicitar Agendamento'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SchedulingModal;