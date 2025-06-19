import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from './Calendar';
import databaseService from '../../../services/databaseService';

// Componentes de ícones simples
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 19h6"/>
    <path d="M16 2v4"/>
    <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"/>
    <path d="M3 10h18"/>
    <path d="M8 2v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
    <path d="m9 16 2 2 4-4"/>
  </svg>
);

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalAgendamentos: 0,
    pendentes: 0,
    concluidos: 0,
    clientesUnicos: 0,
    faturamentoMes: 0,
    previsaoFaturamento: 0
  });
  
  const [proximosAgendamentos, setProximosAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Obter estatísticas
        const estatisticas = await databaseService.getEstatisticas();
        setStats(estatisticas);
        
        // Obter agendamentos do dia atual
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentosHoje = await databaseService.getAgendamentosByDate(hoje);
        
        // Ordenar por horário
        agendamentosHoje.sort((a, b) => a.time.localeCompare(b.time));
        
        // Definir os agendamentos do dia
        setProximosAgendamentos(agendamentosHoje);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        // Dados de fallback em caso de erro
        setProximosAgendamentos([
          {
            cliente: "Carlos Mendes",
            contato: "(85) 98765-4321",
            servico: "manutenção preventiva",
            data: new Date().toISOString().split('T')[0],
            time: "09:30",
            local: "Av. Santos Dumont, 1500, Aldeota, Fortaleza",
            status: "pendente"
          },
          {
            cliente: "Maria Silva",
            contato: "(85) 99876-5432",
            servico: "instalação de maquina",
            data: new Date().toISOString().split('T')[0],
            time: "14:00",
            local: "Rua Padre Valdevino, 250, Joaquim Távora, Fortaleza",
            status: "pendente"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return (
    <div className="p-4">
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333'}}>Dashboard</h1>
      
      {/* Cards de estatísticas */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #3b82f6'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#3b82f6', marginRight: '1rem'}}>
              <CalendarIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Total de Agendamentos</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.totalAgendamentos}</p>
            </div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #f59e0b'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#fef3c7', color: '#f59e0b', marginRight: '1rem'}}>
              <ClockIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Pendentes</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.pendentes}</p>
            </div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #10b981'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#d1fae5', color: '#10b981', marginRight: '1rem'}}>
              <CheckIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Concluídos</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.concluidos}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #8b5cf6'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#ede9fe', color: '#8b5cf6', marginRight: '1rem'}}>
              <UserIcon />
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Clientes</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{stats.clientesUnicos}</p>
            </div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #059669'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#d1fae5', color: '#059669', marginRight: '1rem'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Faturado no Mês</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.faturamentoMes)}</p>
            </div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', borderLeft: '4px solid #0284c7'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#e0f2fe', color: '#0284c7', marginRight: '1rem'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Previsão de Faturamento</p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.previsaoFaturamento)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Agendamentos do dia */}
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem'}}>
        <div style={{borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{fontSize: '1.125rem', fontWeight: '600', color: '#333'}}>
            Agendamentos do Dia
            <span style={{marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: 'normal', color: '#6b7280'}}>
              {new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric', month: 'long'})}
            </span>
          </h2>
          <Link to="/admin/agendamentos" style={{color: '#3b82f6', fontSize: '0.875rem', textDecoration: 'none'}}>
            Ver todos
          </Link>
        </div>
        
        <div style={{padding: '1rem'}}>
          {loading ? (
            <div style={{textAlign: 'center', padding: '2rem 0'}}>
              <p>Carregando agendamentos...</p>
            </div>
          ) : proximosAgendamentos.length === 0 ? (
            <div style={{textAlign: 'center', padding: '2rem 0'}}>
              <div style={{marginBottom: '1rem', color: '#9ca3af'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <p style={{color: '#6b7280', fontSize: '0.875rem'}}>Nenhum agendamento para hoje</p>
              <Link to="/admin/agendamentos" style={{display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.375rem', textDecoration: 'none', fontSize: '0.875rem'}}>
                Agendar serviço
              </Link>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <p style={{fontSize: '0.875rem', color: '#4b5563'}}>
                  <strong>{proximosAgendamentos.length}</strong> agendamento(s) para hoje
                </p>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280'}}>
                    <span style={{width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#fef3c7'}}></span>
                    Pendente
                  </span>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280'}}>
                    <span style={{width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#d1fae5'}}></span>
                    Concluído
                  </span>
                </div>
              </div>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{backgroundColor: '#f9fafb'}}>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Horário</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Cliente</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Contato</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Serviço</th>
                    <th style={{padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Status</th>
                  </tr>
                </thead>
                <tbody style={{borderTop: '1px solid #e5e7eb'}}>
                  {proximosAgendamentos.map((item, index) => (
                    <tr key={index} style={{backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '600', color: '#111827'}}>{item.time}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>{item.cliente}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{item.contato}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280'}}>{item.servico}</td>
                      <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem'}}>
                        <span style={{
                          padding: '0.25rem 0.5rem', 
                          display: 'inline-flex', 
                          fontSize: '0.75rem', 
                          lineHeight: '1.25rem', 
                          fontWeight: '600', 
                          borderRadius: '9999px',
                          backgroundColor: item.status === 'concluido' ? '#d1fae5' : '#fef3c7',
                          color: item.status === 'concluido' ? '#065f46' : '#92400e'
                        }}>
                          {item.status === 'concluido' ? 'Concluído' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Calendário de Agendamentos */}
      <Calendar />
      
      {/* Ações rápidas */}
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1.5rem'}}>
          <h2 style={{fontSize: '1.125rem', fontWeight: '600', color: '#333'}}>Ações Rápidas</h2>
        </div>
        
        <div style={{padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
          <Link to="/admin/agendamentos" style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.3s'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#3b82f6', marginRight: '1rem'}}>
              <CalendarIcon />
            </div>
            <div>
              <h3 style={{fontWeight: '500', color: '#333'}}>Novo Agendamento</h3>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Agendar um novo serviço</p>
            </div>
          </Link>
          
          <Link to="/admin/clientes" style={{display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#f5f3ff', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.3s'}}>
            <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: '#ede9fe', color: '#8b5cf6', marginRight: '1rem'}}>
              <UserIcon />
            </div>
            <div>
              <h3 style={{fontWeight: '500', color: '#333'}}>Gerenciar Clientes</h3>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Visualizar e editar clientes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}