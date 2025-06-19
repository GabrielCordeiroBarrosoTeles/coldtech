import supabase from './supabaseClient';

class SimpleAuthService {
  // Login com email e senha
  async login(email, senha) {
    try {
      // Solução temporária: permitir login com credenciais fixas
      if (email === 'admin@coldtech.com' && senha === 'admin123') {
        // Criar usuário temporário
        const tempUser = {
          id: 1,
          email: 'admin@coldtech.com',
          nome: 'Administrador'
        };
        
        // Salvar informações do usuário no localStorage
        localStorage.setItem('coldtech_user', JSON.stringify({
          ...tempUser,
          isAuthenticated: true
        }));
        
        return tempUser;
      }
      
      // Código original para quando o banco estiver configurado
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      if (!usuario) throw new Error('Usuário não encontrado');
      
      // Verificar senha (simplificado)
      const senhaCorreta = usuario.senha === senha;
      if (!senhaCorreta) throw new Error('Senha incorreta');
      
      // Atualizar último login
      await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date() })
        .eq('id', usuario.id);
      
      // Salvar informações do usuário no localStorage
      localStorage.setItem('coldtech_user', JSON.stringify({
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        isAuthenticated: true
      }));
      
      return {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }
  
  // Verificar se o usuário está autenticado
  isAuthenticated() {
    const user = localStorage.getItem('coldtech_user');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      return userData.isAuthenticated === true;
    } catch {
      return false;
    }
  }
  
  // Logout
  logout() {
    localStorage.removeItem('coldtech_user');
    localStorage.removeItem('user');
    sessionStorage.clear();
  }
  
  // Obter dados do usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('coldtech_user');
    if (!user) return null;
    
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}

const simpleAuthService = new SimpleAuthService();
export default simpleAuthService;