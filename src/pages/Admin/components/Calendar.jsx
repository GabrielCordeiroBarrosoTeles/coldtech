import React, { useState, useEffect } from 'react';
import './Calendar.css';
import databaseService from '../../../services/databaseService';

// Ícones para navegação
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Carregar agendamentos
  useEffect(() => {
    const loadAgendamentos = async () => {
      try {
        setLoading(true);
        const agendamentosData = await databaseService.getAgendamentos();
        setAgendamentos(agendamentosData);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAgendamentos();
  }, []);
  
  // Atualizar agendamentos do dia quando a data selecionada mudar
  useEffect(() => {
    const loadAgendamentosDoDia = async () => {
      if (selectedDate) {
        try {
          const dataFormatada = selectedDate.toISOString().split('T')[0];
          const agendamentosFiltrados = await databaseService.getAgendamentosByDate(dataFormatada);
          setAgendamentosDoDia(agendamentosFiltrados);
        } catch (error) {
          console.error("Erro ao carregar agendamentos do dia:", error);
          // Fallback para filtro local
          const dataFormatada = selectedDate.toISOString().split('T')[0];
          const agendamentosFiltrados = agendamentos.filter(
            item => item.data === dataFormatada
          );
          setAgendamentosDoDia(agendamentosFiltrados);
        }
      } else {
        setAgendamentosDoDia([]);
      }
    };
    
    loadAgendamentosDoDia();
  }, [selectedDate, agendamentos]);

  // Funções para navegação do calendário
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Função para formatar a data
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Gerar dias do mês atual
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    
    // Adicionar dias vazios para alinhar com o dia da semana correto
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', empty: true });
    }
    
    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Verificar se há agendamentos neste dia
      const hasAgendamentos = agendamentos.some(item => item.data === dateString);
      
      days.push({
        day,
        date,
        hasAgendamentos,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: selectedDate && date.toDateString() === selectedDate.toDateString()
      });
    }
    
    return days;
  };

  // Obter nome do mês e ano atual
  const getMonthName = () => {
    return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Selecionar um dia
  const selectDay = (day) => {
    if (day.date) {
      setSelectedDate(day.date);
    }
  };

  if (loading) {
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <h2>Calendário de Agendamentos</h2>
        </div>
        <div style={{textAlign: 'center', padding: '2rem 0'}}>
          <p>Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendário de Agendamentos</h2>
        <div className="calendar-nav">
          <button onClick={prevMonth} className="nav-button">
            <ChevronLeft />
          </button>
          <span className="current-month">{getMonthName()}</span>
          <button onClick={nextMonth} className="nav-button">
            <ChevronRight />
          </button>
        </div>
      </div>
      
      <div className="calendar">
        <div className="weekdays">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>
        
        <div className="days">
          {getDaysInMonth().map((day, index) => (
            <div
              key={index}
              className={`day ${day.empty ? 'empty' : ''} ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''} ${day.hasAgendamentos ? 'has-events' : ''}`}
              onClick={() => !day.empty && selectDay(day)}
            >
              <span>{day.day}</span>
              {day.hasAgendamentos && <div className="event-dot"></div>}
            </div>
          ))}
        </div>
      </div>
      
      {selectedDate && (
        <div className="day-events">
          <h3>Agendamentos para {formatDate(selectedDate)}</h3>
          {agendamentosDoDia.length === 0 ? (
            <p className="no-events">Nenhum agendamento para este dia</p>
          ) : (
            <div className="events-list">
              {agendamentosDoDia.map((agendamento, index) => (
                <div key={index} className={`event-card ${agendamento.status === 'concluido' ? 'completed' : 'pending'}`}>
                  <div className="event-time">
                    <ClockIcon /> {agendamento.time}
                  </div>
                  <div className="event-details">
                    <div className="event-client">{agendamento.cliente}</div>
                    <div className="event-service">{agendamento.servico}</div>
                    <div className="event-location">{agendamento.local}</div>
                    <div className={`event-status ${agendamento.status === 'concluido' ? 'status-completed' : 'status-pending'}`}>
                      {agendamento.status === 'concluido' ? 'Concluído' : 'Pendente'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}