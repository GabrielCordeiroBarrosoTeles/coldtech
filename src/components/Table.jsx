import React, { useState, useEffect } from "react";
import "./Table.css";
import databaseService from "../services/databaseService";

// Ícones simples em SVG
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14"></path>
    <path d="M5 12h14"></path>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

// Tipos de serviço disponíveis
const tiposServico = [
  "manutenção preventiva",
  "manutenção corretiva",
  "instalação de maquina",
  "outros"
];

export default function Table() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
  const [form, setForm] = useState({
    cliente: "",
    contato: "",
    servico: tiposServico[0],
    data: "",
    time: "",
    local: "",
    status: "pendente",
  });
  
  // Estado para edição
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dataFilter, setDataFilter] = useState("");

  // Carrega os dados do Supabase ao iniciar
  useEffect(() => {
    const loadAgendamentos = async () => {
      try {
        const agendamentosData = await databaseService.getAgendamentos();
        setAgendamentos(agendamentosData);
        setFilteredAgendamentos(agendamentosData);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      }
    };
    
    loadAgendamentos();
  }, []);

  // Efeito para aplicar filtros quando os critérios mudarem
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dataFilter, agendamentos]);

  // Efeito para compartilhar dados com o dashboard
  useEffect(() => {
    // Publicar dados para uso em outros componentes
    localStorage.setItem('agendamentosData', JSON.stringify({
      total: agendamentos.length,
      pendentes: agendamentos.filter(item => item.status === 'pendente').length,
      concluidos: agendamentos.filter(item => item.status === 'concluido').length,
      hoje: agendamentos.filter(item => item.data === new Date().toISOString().split('T')[0])
    }));
  }, [agendamentos]);

  const applyFilters = () => {
    let result = [...agendamentos];
    
    // Filtro por nome do cliente
    if (searchTerm) {
      result = result.filter(item => 
        item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por status
    if (statusFilter !== "todos") {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Filtro por data
    if (dataFilter) {
      result = result.filter(item => item.data === dataFilter);
    }
    
    setFilteredAgendamentos(result);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleAdd = async () => {
    // Validação dos campos
    if (!form.cliente || !form.contato || !form.servico || !form.data || !form.time || !form.local) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (editMode && editIndex !== null) {
        // Atualizar agendamento existente
        const updatedAgendamento = await databaseService.updateAgendamento(editIndex, form);
        
        // Atualizar a lista local
        const updatedAgendamentos = [...agendamentos];
        const index = updatedAgendamentos.findIndex(item => item.id === form.id);
        if (index !== -1) {
          updatedAgendamentos[index] = updatedAgendamento;
        }
        setAgendamentos(updatedAgendamentos);
        
        // Sair do modo de edição
        setEditMode(false);
        setEditIndex(null);
      } else {
        // Adicionar novo agendamento
        const newAgendamento = await databaseService.addAgendamento(form);
        
        // Adiciona o novo agendamento no início da lista
        setAgendamentos([newAgendamento, ...agendamentos]);
      }
      
      // Limpa o formulário
      setForm({
        cliente: "",
        contato: "",
        servico: tiposServico[0],
        data: "",
        time: "",
        local: "",
        status: "pendente"
      });
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Erro ao salvar agendamento. Tente novamente.");
    }
  };

  const handleEdit = (index) => {
    // Carregar dados do agendamento para o formulário
    setForm({...agendamentos[index]});
    setEditMode(true);
    setEditIndex(index);
    
    // Rolar para o topo para editar
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditIndex(null);
    setForm({
      cliente: "",
      contato: "",
      servico: tiposServico[0],
      data: "",
      time: "",
      local: "",
      status: "pendente"
    });
  };

  const handleDelete = async (indexToDelete) => {
    const confirm = window.confirm("Tem certeza que deseja excluir?");
    if (!confirm) return;
    
    try {
      const agendamentoToDelete = agendamentos[indexToDelete];
      
      // Excluir do Supabase
      await databaseService.deleteAgendamento(indexToDelete, agendamentoToDelete.id);
      
      // Atualizar a lista local
      const newAgendamentos = agendamentos.filter((_, index) => index !== indexToDelete);
      setAgendamentos(newAgendamentos);
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      alert("Erro ao excluir agendamento. Tente novamente.");
    }
  };

  const handleStatusChange = async (index) => {
    try {
      const updatedAgendamentos = [...agendamentos];
      const agendamento = {...updatedAgendamentos[index]};
      
      // Alternar status
      agendamento.status = agendamento.status === "pendente" ? "concluido" : "pendente";
      
      // Atualizar no Supabase
      const updatedAgendamento = await databaseService.updateAgendamento(index, agendamento);
      
      // Atualizar a lista local
      updatedAgendamentos[index] = updatedAgendamento;
      setAgendamentos(updatedAgendamentos);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const getStatusClass = (status) => {
    return status === "concluido" ? "status-enviado" : "status-pendente";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setDataFilter("");
  };

  return (
    <div className="container">
      <h2 className="title">Agenda de Serviços</h2>
      
      {/* Formulário de Adição/Edição */}
      <div className="form-container">
        <h3 className="form-title">
          {editMode ? "Editar Agendamento" : "Adicionar Novo Agendamento"}
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nome do Cliente</label>
            <input
              type="text"
              name="cliente"
              placeholder="Nome completo"
              value={form.cliente}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contato</label>
            <input
              type="text"
              name="contato"
              placeholder="(00) 00000-0000"
              value={form.contato}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de Serviço</label>
            <select
              name="servico"
              value={form.servico}
              onChange={handleChange}
              className="form-input"
            >
              {tiposServico.map((tipo, index) => (
                <option key={index} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Horário</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Endereço Completo</label>
            <input
              type="text"
              name="local"
              placeholder="Rua, número, bairro, cidade"
              value={form.local}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group button-container">
            <button
              onClick={handleAdd}
              className="add-button"
              type="button"
            >
              {editMode ? "Atualizar" : "Adicionar"}
            </button>
            {editMode && (
              <button
                onClick={cancelEdit}
                className="cancel-button"
                type="button"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">
            <SearchIcon /> Buscar por cliente:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nome do cliente"
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">
            <FilterIcon /> Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="concluido">Concluídos</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">
            <CalendarIcon /> Data:
          </label>
          <input
            type="date"
            value={dataFilter}
            onChange={(e) => setDataFilter(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <button onClick={clearFilters} className="clear-filters-button">
          Limpar Filtros
        </button>
      </div>

      {/* Tabela */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contato</th>
              <th>Serviço</th>
              <th>Data/Hora</th>
              <th>Local</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgendamentos.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-message">
                  Nenhum agendamento encontrado
                </td>
              </tr>
            ) : (
              filteredAgendamentos.map((item, index) => {
                // Encontrar o índice real no array original
                const originalIndex = agendamentos.findIndex(
                  ag => ag.cliente === item.cliente && 
                        ag.data === item.data && 
                        ag.time === item.time
                );
                
                return (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? "row-even" : "row-odd"}
                  >
                    <td>
                      <div className="client-name">{item.cliente}</div>
                    </td>
                    <td>
                      <div className="contact">
                        <PhoneIcon />
                        <span>{item.contato || "-"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="service-name">{item.servico}</div>
                    </td>
                    <td>
                      <div className="date-time">
                        <CalendarIcon />
                        <span className="date">{formatDate(item.data)}</span>
                        <ClockIcon />
                        <span>{item.time}</span>
                      </div>
                    </td>
                    <td>
                      <div className="location">
                        <MapPinIcon />
                        <span>{item.local}</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className={`status-toggle ${getStatusClass(item.status)}`}
                        onClick={() => handleStatusChange(originalIndex)}
                      >
                        <span className="status-dot"></span>
                        {item.status === "concluido" ? "Concluído" : "Pendente"}
                      </button>
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleEdit(originalIndex)}
                        className="edit-button"
                        title="Editar"
                        type="button"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(originalIndex)}
                        className="delete-button"
                        title="Excluir"
                        type="button"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}