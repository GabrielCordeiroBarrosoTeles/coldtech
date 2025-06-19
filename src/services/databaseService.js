import supabase from './supabaseClient';
import databaseData from '../data/database.json';

// Classe para gerenciar o acesso aos dados
class DatabaseService {
  constructor() {
    // Inicializa o estado com os dados do JSON ou do localStorage
    this.initializeData();
  }

  // Inicializa os dados do sistema
  async initializeData() {
    try {
      // Verificar se já existem dados no Supabase
      const { data: agendamentos, error } = await supabase.from('agendamentos').select('*').limit(1);
      
      if (error) {
        throw error;
      }
      
      if (!agendamentos || agendamentos.length === 0) {
        // Se não houver dados, inicializar com os dados do JSON
        await this.initializeSupabaseData();
      }
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
      // Fallback para localStorage
      this.useFallbackData();
    }
  }

  // Inicializar dados no Supabase
  async initializeSupabaseData() {
    try {
      // Inserir serviços
      await supabase.from('servicos').insert(databaseData.servicos);
      
      // Inserir clientes
      await supabase.from('clientes').insert(databaseData.clientes.map(cliente => ({
        nome: cliente.nome,
        contato: cliente.contato,
        endereco: cliente.endereco
      })));
      
      // Obter clientes inseridos para referência
      const { data: clientesInseridos } = await supabase.from('clientes').select('*');
      const { data: servicosInseridos } = await supabase.from('servicos').select('*');
      
      // Mapear agendamentos com as referências corretas
      const agendamentosParaInserir = databaseData.agendamentos.map(agendamento => {
        const cliente = clientesInseridos.find(c => c.nome === agendamento.cliente);
        const servico = servicosInseridos.find(s => s.tipo === agendamento.servico);
        
        return {
          cliente_id: cliente?.id,
          servico_id: servico?.id,
          data: agendamento.data,
          time: agendamento.time,
          local: agendamento.local,
          status: agendamento.status
        };
      });
      
      // Inserir agendamentos
      await supabase.from('agendamentos').insert(agendamentosParaInserir);
    } catch (error) {
      console.error('Erro ao inicializar dados no Supabase:', error);
    }
  }

  // Usar dados do localStorage como fallback
  useFallbackData() {
    const savedData = localStorage.getItem('coldtech_database');
    if (savedData) {
      this.database = JSON.parse(savedData);
    } else {
      this.database = databaseData;
      this.saveToLocalStorage();
    }
  }

  // Salva os dados no localStorage (fallback)
  saveToLocalStorage() {
    localStorage.setItem('coldtech_database', JSON.stringify(this.database));
  }

  // AGENDAMENTOS
  async getAgendamentos() {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .order('data', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        preco: item.preco_personalizado,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      // Fallback para dados locais
      return this.database?.agendamentos || [];
    }
  }

  async getAgendamentosByDate(date) {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .eq('data', date)
        .order('time', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        preco: item.preco_personalizado,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      // Fallback para dados locais
      return this.database?.agendamentos.filter(item => item.data === date) || [];
    }
  }

  async getAgendamentosPendentes() {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .eq('status', 'pendente')
        .order('data', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        preco: item.preco_personalizado,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos pendentes:', error);
      // Fallback para dados locais
      return this.database?.agendamentos.filter(item => item.status === 'pendente') || [];
    }
  }

  async getAgendamentosConcluidos() {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .eq('status', 'concluido')
        .order('data', { ascending: true });
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return data.map(item => ({
        id: item.id,
        cliente: item.clientes?.nome || '',
        contato: item.clientes?.contato || '',
        servico: item.servicos?.tipo || '',
        data: item.data,
        time: item.time,
        local: item.local,
        preco: item.preco_personalizado,
        status: item.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos concluídos:', error);
      // Fallback para dados locais
      return this.database?.agendamentos.filter(item => item.status === 'concluido') || [];
    }
  }

  async addAgendamento(agendamento) {
    try {
      // Buscar ou criar cliente
      let cliente_id;
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('nome', agendamento.cliente)
        .single();
      
      if (clienteExistente) {
        cliente_id = clienteExistente.id;
      } else {
        const { data: novoCliente } = await supabase
          .from('clientes')
          .insert({
            nome: agendamento.cliente,
            contato: agendamento.contato,
            endereco: agendamento.local
          })
          .select('id')
          .single();
        
        cliente_id = novoCliente.id;
      }
      
      // Buscar serviço
      const { data: servico } = await supabase
        .from('servicos')
        .select('id')
        .eq('tipo', agendamento.servico)
        .single();
      
      // Inserir agendamento
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          cliente_id,
          servico_id: servico.id,
          data: agendamento.data,
          time: agendamento.time,
          local: agendamento.local,
          preco_personalizado: agendamento.preco,
          status: agendamento.status
        })
        .select(`
          *,
          clientes (nome, contato),
          servicos (tipo)
        `)
        .single();
      
      if (error) throw error;
      
      // Transformar para o formato esperado pela aplicação
      return {
        id: data.id,
        cliente: data.clientes?.nome || '',
        contato: data.clientes?.contato || '',
        servico: data.servicos?.tipo || '',
        data: data.data,
        time: data.time,
        local: data.local,
        preco: data.preco_personalizado,
        status: data.status
      };
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      // Fallback para dados locais
      if (this.database?.agendamentos) {
        this.database.agendamentos.unshift(agendamento);
        this.saveToLocalStorage();
      }
      return agendamento;
    }
  }

  async updateAgendamento(index, agendamento) {
    try {
      if (!agendamento.id) {
        throw new Error('ID do agendamento não fornecido');
      }
      
      console.log('Atualizando agendamento:', agendamento);
      
      // Buscar serviço
      const { data: servico } = await supabase
        .from('servicos')
        .select('id')
        .eq('tipo', agendamento.servico)
        .single();
      
      // Atualização direta no banco de dados sem verificações adicionais
      const { data, error } = await supabase
        .from('agendamentos')
        .update({
          data: agendamento.data,
          time: agendamento.time,
          servico_id: servico.id,  // Adicionar esta linha para atualizar o serviço
          preco_personalizado: agendamento.preco,
          status: agendamento.status
        })
        .eq('id', agendamento.id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro na atualização:', error);
        throw error;
      }
      
      console.log('Agendamento atualizado com sucesso:', data);
      
      // Retornar o agendamento atualizado no formato esperado pela aplicação
      return {
        id: data.id,
        cliente: agendamento.cliente,
        contato: agendamento.contato,
        servico: agendamento.servico,
        data: data.data,
        time: data.time,
        local: agendamento.local,
        preco: data.preco_personalizado,
        status: data.status
      };
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      // Fallback para dados locais
      if (this.database?.agendamentos && index !== undefined) {
        this.database.agendamentos[index] = agendamento;
        this.saveToLocalStorage();
      }
      return agendamento;
    }
  }

  async deleteAgendamento(index, id) {
    try {
      if (id) {
        const { error } = await supabase
          .from('agendamentos')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      } else {
        throw new Error('ID do agendamento não fornecido');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      // Fallback para dados locais
      if (this.database?.agendamentos && index !== undefined) {
        const removed = this.database.agendamentos.splice(index, 1);
        this.saveToLocalStorage();
        return removed[0];
      }
      return null;
    }
  }

  // CLIENTES
  async getClientes() {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return this.database?.clientes || [];
    }
  }

  // Adicionar cliente
  async addCliente(cliente) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert(cliente)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      return null;
    }
  }

  // Atualizar cliente
  async updateCliente(id, cliente) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(cliente)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return null;
    }
  }

  // Excluir cliente
  async deleteCliente(id) {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      return false;
    }
  }

  // SERVIÇOS
  async getServicos() {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return this.database?.servicos || [];
    }
  }

  // Estatísticas
  async getEstatisticas() {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const dataAtual = new Date();
      const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1).toISOString().split('T')[0];
      const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0).toISOString().split('T')[0];
      
      // Contar total de agendamentos
      const { count: totalAgendamentos, error: errorTotal } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true });
      
      if (errorTotal) throw errorTotal;
      
      // Contar agendamentos pendentes
      const { count: pendentes, error: errorPendentes } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      
      if (errorPendentes) throw errorPendentes;
      
      // Contar agendamentos concluídos
      const { count: concluidos, error: errorConcluidos } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'concluido');
      
      if (errorConcluidos) throw errorConcluidos;
      
      // Contar clientes únicos
      const { count: clientesUnicos, error: errorClientes } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });
      
      if (errorClientes) throw errorClientes;
      
      // Contar agendamentos de hoje
      const { count: agendamentosHoje, error: errorHoje } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('data', hoje);
      
      if (errorHoje) throw errorHoje;
      
      // Inicializar valores padrão para evitar NaN
      let faturamentoMes = 0;
      let previsaoFaturamento = 0;
      
      try {
        // Calcular faturamento do mês (agendamentos concluídos)
        const { data: agendamentosConcluidos, error: errorFaturamento } = await supabase
          .from('agendamentos')
          .select('preco_personalizado')
          .eq('status', 'concluido')
          .gte('data', primeiroDiaMes)
          .lte('data', ultimoDiaMes);
        
        if (errorFaturamento) throw errorFaturamento;
        
        if (agendamentosConcluidos && agendamentosConcluidos.length > 0) {
          faturamentoMes = agendamentosConcluidos.reduce((total, item) => {
            // Garantir que o valor seja um número válido
            const precoStr = String(item.preco_personalizado || '0');
            const precoNum = parseFloat(precoStr.replace(',', '.'));
            return total + (isNaN(precoNum) ? 0 : precoNum);
          }, 0);
        }
        
        // Calcular previsão de faturamento (todos os agendamentos do mês)
        const { data: todosAgendamentosMes, error: errorPrevisao } = await supabase
          .from('agendamentos')
          .select('preco_personalizado, status')
          .gte('data', primeiroDiaMes)
          .lte('data', ultimoDiaMes);
        
        if (errorPrevisao) throw errorPrevisao;
        
        if (todosAgendamentosMes && todosAgendamentosMes.length > 0) {
          previsaoFaturamento = todosAgendamentosMes.reduce((total, item) => {
            // Garantir que o valor seja um número válido
            const precoStr = String(item.preco_personalizado || '0');
            const precoNum = parseFloat(precoStr.replace(',', '.'));
            return total + (isNaN(precoNum) ? 0 : precoNum);
          }, 0);
        }
      } catch (error) {
        console.error('Erro ao calcular faturamento:', error);
        // Manter os valores padrão em caso de erro
      }
      
      return {
        totalAgendamentos: totalAgendamentos || 0,
        pendentes: pendentes || 0,
        concluidos: concluidos || 0,
        clientesUnicos: clientesUnicos || 0,
        agendamentosHoje: agendamentosHoje || 0,
        faturamentoMes: faturamentoMes || 0,
        previsaoFaturamento: previsaoFaturamento || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      
      // Fallback para cálculo local
      const agendamentos = await this.getAgendamentos();
      const hoje = new Date().toISOString().split('T')[0];
      
      return {
        totalAgendamentos: agendamentos.length,
        pendentes: agendamentos.filter(item => item.status === 'pendente').length,
        concluidos: agendamentos.filter(item => item.status === 'concluido').length,
        clientesUnicos: new Set(agendamentos.map(item => item.cliente)).size,
        agendamentosHoje: agendamentos.filter(item => item.data === hoje).length
      };
    }
  }
}

// Exporta uma instância única do serviço
const databaseService = new DatabaseService();
export default databaseService;