// Sistema de Autenticação e Gestão de Usuários
class AuthSystem {
    constructor() {
        this.usuarios = [];
        this.usuarioAtual = null;
        this.init();
    }

    init() {
        this.carregarUsuarios();
        this.verificarAutenticacao();
    }

    // Carregar usuários do localStorage
    carregarUsuarios() {
        const usuariosSalvos = localStorage.getItem('autoEscolaUsuarios');
        
        if (usuariosSalvos) {
            this.usuarios = JSON.parse(usuariosSalvos);
        } else {
            // Criar usuário admin padrão se não existir
            this.criarUsuarioAdmin();
        }
    }

    // Salvar usuários no localStorage
    salvarUsuarios() {
        localStorage.setItem('autoEscolaUsuarios', JSON.stringify(this.usuarios));
    }

    // Criar usuário admin padrão
    criarUsuarioAdmin() {
        const adminUser = {
            id: this.gerarId(),
            nome: 'Admin',
            usuario: 'Admin',
            senha: this.criptografarSenha('Admin'),
            email: 'admin@autoescola.com',
            tipo: 'admin',
            ativo: true,
            dataCriacao: new Date().toISOString(),
            ultimoLogin: null
        };
        
        this.usuarios.push(adminUser);
        this.salvarUsuarios();
    }

    // Gerar ID único
    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Criptografar senha (simples para demonstração)
    criptografarSenha(senha) {
        return btoa(senha + '_autoescola_2024');
    }

    // Verificar senha
    verificarSenha(senha, senhaCriptografada) {
        return this.criptografarSenha(senha) === senhaCriptografada;
    }

    // Fazer login
    fazerLogin(usuario, senha) {
        const user = this.usuarios.find(u => 
            u.usuario === usuario && 
            u.ativo === true
        );

        if (user && this.verificarSenha(senha, user.senha)) {
            // Atualizar último login
            user.ultimoLogin = new Date().toISOString();
            this.salvarUsuarios();
            
            this.usuarioAtual = user;
            localStorage.setItem('autoEscolaUsuarioAtual', JSON.stringify(user));
            
            return { success: true, usuario: user };
        }
        
        return { success: false, message: 'Usuário ou senha inválidos' };
    }

    // Fazer logout
    fazerLogout() {
        this.usuarioAtual = null;
        localStorage.removeItem('autoEscolaUsuarioAtual');
        this.mostrarTelaLogin();
    }

    // Verificar se está autenticado
    verificarAutenticacao() {
        const usuarioSalvo = localStorage.getItem('autoEscolaUsuarioAtual');
        
        if (usuarioSalvo) {
            this.usuarioAtual = JSON.parse(usuarioSalvo);
            this.mostrarTelaPrincipal();
        } else {
            this.mostrarTelaLogin();
        }
    }

    // Criar novo usuário
    criarUsuario(dados) {
        // Verificar se usuário já existe
        const usuarioExiste = this.usuarios.some(u => u.usuario === dados.usuario);
        if (usuarioExiste) {
            return { success: false, message: 'Nome de usuário já existe' };
        }

        // Verificar se email já existe
        const emailExiste = this.usuarios.some(u => u.email === dados.email);
        if (emailExiste) {
            return { success: false, message: 'Email já cadastrado' };
        }

        const novoUsuario = {
            id: this.gerarId(),
            nome: dados.nome,
            usuario: dados.usuario,
            senha: this.criptografarSenha(dados.senha),
            email: dados.email,
            tipo: dados.tipo || 'usuario',
            ativo: true,
            dataCriacao: new Date().toISOString(),
            ultimoLogin: null
        };

        this.usuarios.push(novoUsuario);
        this.salvarUsuarios();

        return { success: true, usuario: novoUsuario };
    }

    // Atualizar senha
    atualizarSenha(usuarioId, senhaAtual, novaSenha) {
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        
        if (!usuario) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        if (!this.verificarSenha(senhaAtual, usuario.senha)) {
            return { success: false, message: 'Senha atual incorreta' };
        }

        usuario.senha = this.criptografarSenha(novaSenha);
        this.salvarUsuarios();

        return { success: true, message: 'Senha atualizada com sucesso' };
    }

    // Ativar/Desativar usuário
    _alternarStatusUsuario(usuarioId) {
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        
        if (!usuario) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        // Não permitir desativar o próprio usuário
        if (usuario.id === this.usuarioAtual.id) {
            return { success: false, message: 'Não é possível desativar seu próprio usuário' };
        }

        usuario.ativo = !usuario.ativo;
        this.salvarUsuarios();

        return { 
            success: true, 
            message: `Usuário ${usuario.ativo ? 'ativado' : 'desativado'} com sucesso`,
            ativo: usuario.ativo
        };
    }

    // Excluir usuário
    _excluirUsuario(usuarioId) {
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        
        if (!usuario) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        // Não permitir excluir o próprio usuário
        if (usuario.id === this.usuarioAtual.id) {
            return { success: false, message: 'Não é possível excluir seu próprio usuário' };
        }

        // Não permitir excluir usuários admin
        if (usuario.tipo === 'admin') {
            return { success: false, message: 'Não é possível excluir usuários administradores' };
        }

        const index = this.usuarios.findIndex(u => u.id === usuarioId);
        this.usuarios.splice(index, 1);
        this.salvarUsuarios();

        return { success: true, message: 'Usuário excluído com sucesso' };
    }

    // Verificar permissões
    temPermissao(permissao) {
        if (!this.usuarioAtual) return false;
        
        if (this.usuarioAtual.tipo === 'admin') return true;
        
        // Adicionar outras verificações de permissão aqui se necessário
        return false;
    }

    // Mostrar tela de login
    mostrarTelaLogin() {
        document.body.innerHTML = this.getLoginHTML();
        this.setupLoginEvents();
    }

    // Mostrar tela principal
    mostrarTelaPrincipal() {
        document.body.innerHTML = this.getMainHTML();
        this.setupMainEvents();
        
        // Inicializar a aplicação principal
        if (window.app) {
            window.app.init();
        } else {
            window.app = new AutoEscolaApp();
        }
    }

    // HTML da tela de login
    getLoginHTML() {
        return `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <i class="fas fa-car"></i>
                        <h1>Auto Escola</h1>
                        <p>Sistema de Gestão de Alunos</p>
                    </div>
                    
                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <label for="usuario">Usuário</label>
                            <input type="text" id="usuario" name="usuario" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="senha">Senha</label>
                            <input type="password" id="senha" name="senha" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-login">
                            <i class="fas fa-sign-in-alt"></i> Entrar
                        </button>
                    </form>
                    
                    
                </div>
            </div>
        `;
    }

    // HTML da tela principal
    getMainHTML() {
        return `
            <div class="container">
                <header class="header">
                    <div class="header-content">
                        <h1><i class="fas fa-car"></i> Auto Escola - Gestão de Alunos</h1>
                        <div class="user-menu">
                            <span class="user-info">
                                <i class="fas fa-user"></i> ${this.usuarioAtual.nome}
                            </span>
                            <div class="user-dropdown">
                                <button class="btn btn-secondary btn-sm" onclick="auth.showUserMenu()">
                                    <i class="fas fa-cog"></i> Configurações
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="auth.fazerLogout()">
                                    <i class="fas fa-sign-out-alt"></i> Sair
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main class="main-content">
                    <!-- Formulário de Cadastro/Edição -->
                    <section class="form-section">
                        <h2 id="form-title">Cadastrar Novo Aluno</h2>
                        <form id="aluno-form" class="aluno-form">
                            <input type="hidden" id="aluno-id" value="">
                            
                            <div class="form-group">
                                <label for="nome">Nome Completo *</label>
                                <input type="text" id="nome" name="nome" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cpf">CPF *</label>
                                    <input type="text" id="cpf" name="cpf" required maxlength="14">
                                </div>
                                <div class="form-group">
                                    <label for="telefone">Telefone *</label>
                                    <input type="text" id="telefone" name="telefone" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="data-nascimento">Data de Nascimento *</label>
                                    <input type="date" id="data-nascimento" name="data-nascimento" required>
                                </div>
                                <div class="form-group">
                                    <label for="categoria">Categoria da CNH</label>
                                    <select id="categoria" name="categoria">
                                        <option value="">Selecione...</option>
                                        <option value="A">A - Motocicleta</option>
                                        <option value="B">B - Automóvel</option>
                                        <option value="AB">AB - A+B</option>
                                        <option value="C">C - Caminhão</option>
                                        <option value="D">D - Ônibus</option>
                                        <option value="E">E - Reboque</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="endereco">Endereço</label>
                                <textarea id="endereco" name="endereco" rows="2"></textarea>
                            </div>

                            <div class="form-group">
                                <label for="observacoes">Observações</label>
                                <textarea id="observacoes" name="observacoes" rows="3"></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary" id="submit-btn">
                                    <i class="fas fa-save"></i> Salvar
                                </button>
                                <button type="button" class="btn btn-secondary" id="cancel-btn" style="display: none;">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                            </div>
                        </form>
                    </section>

                    <!-- Seção de Documentos -->
                    <section class="documentos-section">
                        <h2>Documentos do Aluno</h2>
                        <div class="documentos-container">
                            <div class="upload-area">
                                <input type="file" id="documento-upload" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                                <label for="documento-upload" class="upload-label">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span>Clique para anexar documentos</span>
                                </label>
                            </div>
                            <div id="documentos-lista" class="documentos-lista"></div>
                        </div>
                    </section>

                    <!-- Lista de Alunos -->
                    <section class="alunos-section">
                        <h2>Alunos Cadastrados</h2>
                        <div class="search-bar">
                            <input type="text" id="search-input" placeholder="Buscar por nome, CPF ou telefone...">
                            <i class="fas fa-search"></i>
                        </div>
                        <div class="alunos-table-container">
                            <table class="alunos-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>CPF</th>
                                        <th>Telefone</th>
                                        <th>Categoria</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="alunos-tbody">
                                    <!-- Alunos serão inseridos aqui dinamicamente -->
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>

            <!-- Modal de Confirmação -->
            <div id="confirm-modal" class="modal">
                <div class="modal-content">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja excluir este aluno?</p>
                    <div class="modal-actions">
                        <button class="btn btn-danger" id="confirm-delete">Excluir</button>
                        <button class="btn btn-secondary" id="cancel-delete">Cancelar</button>
                    </div>
                </div>
            </div>

            <!-- Modal de Visualização -->
            <div id="view-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Detalhes do Aluno</h3>
                    <div id="aluno-details"></div>
                </div>
            </div>

            <!-- Modal de Gestão de Usuários -->
            <div id="users-modal" class="modal">
                <div class="modal-content modal-large">
                    <span class="close">&times;</span>
                    <h3>Gestão de Usuários</h3>
                    
                    <div class="users-tabs">
                        <button class="tab-btn active" onclick="auth.showTab('users-list', this)">Lista de Usuários</button>
                        <button class="tab-btn" onclick="auth.showTab('create-user', this)">Criar Usuário</button>
                        <button class="tab-btn" onclick="auth.showTab('change-password', this)">Alterar Senha</button>
                    </div>
                    
                    <div id="users-list" class="tab-content active">
                        <div class="users-table-container">
                            <table class="users-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Usuário</th>
                                        <th>Email</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Último Login</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="users-tbody">
                                    <!-- Usuários serão inseridos aqui -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div id="create-user" class="tab-content">
                        <form id="create-user-form" class="create-user-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="new-user-nome">Nome Completo *</label>
                                    <input type="text" id="new-user-nome" name="nome" required>
                                </div>
                                <div class="form-group">
                                    <label for="new-user-usuario">Nome de Usuário *</label>
                                    <input type="text" id="new-user-usuario" name="usuario" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="new-user-email">Email *</label>
                                    <input type="email" id="new-user-email" name="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="new-user-tipo">Tipo de Usuário</label>
                                    <select id="new-user-tipo" name="tipo">
                                        <option value="usuario">Usuário</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="new-user-senha">Senha *</label>
                                    <input type="password" id="new-user-senha" name="senha" required>
                                </div>
                                <div class="form-group">
                                    <label for="new-user-confirmar-senha">Confirmar Senha *</label>
                                    <input type="password" id="new-user-confirmar-senha" name="confirmarSenha" required>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-user-plus"></i> Criar Usuário
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div id="change-password" class="tab-content">
                        <form id="change-password-form" class="change-password-form">
                            <div class="form-group">
                                <label for="current-password">Senha Atual *</label>
                                <input type="password" id="current-password" name="senhaAtual" required>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="new-password">Nova Senha *</label>
                                    <input type="password" id="new-password" name="novaSenha" required>
                                </div>
                                <div class="form-group">
                                    <label for="confirm-new-password">Confirmar Nova Senha *</label>
                                    <input type="password" id="confirm-new-password" name="confirmarNovaSenha" required>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-key"></i> Alterar Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal de Confirmação de Exclusão de Usuário -->
            <div id="confirm-delete-user-modal" class="modal">
                <div class="modal-content">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem certeza que deseja excluir este usuário?</p>
                    <div class="modal-actions">
                        <button class="btn btn-danger" onclick="auth.confirmarExclusaoUsuario()">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                        <button class="btn btn-secondary" onclick="auth.fecharModal('confirm-delete-user-modal')">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>

            <script src="js/app.js"></script>
            <script src="dados-exemplo.js"></script>
        `;
    }

    // Configurar eventos da tela de login
    setupLoginEvents() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Configurar eventos da tela principal
    setupMainEvents() {
        // Aguardar um pouco para garantir que o DOM esteja pronto
        setTimeout(() => {
            this.renderizarUsuarios();
            this.setupUserEvents();
            // Adiciona evento para fechar o modal de usuários ao clicar no X
        const usersModalClose = document.querySelector('#users-modal .close');
        if (usersModalClose) {
            usersModalClose.onclick = () => this.fecharModal('users-modal');}
            
        }, 100);
    }

    // Handle do formulário de login
    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const usuario = formData.get('usuario');
        const senha = formData.get('senha');
        
        const resultado = this.fazerLogin(usuario, senha);
        
        if (resultado.success) {
            if (window.showToast) window.showToast('Login realizado com sucesso!', 'success');
            this.mostrarTelaPrincipal();
        } else {
            if (window.showToast) window.showToast(resultado.message || 'Usuário ou senha inválidos.', 'error');
        }
    }

    // Mostrar menu de usuário
    showUserMenu() {
        this.abrirModal('users-modal');
        this.renderizarUsuarios();
    }

    // Mostrar aba específica
    showTab(tabId, clickedButton) {
        // Esconder todas as abas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remover classe active de todos os botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar aba selecionada
        document.getElementById(tabId).classList.add('active');
        
        // Adicionar classe active ao botão clicado
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
    }

    // Renderizar lista de usuários
    renderizarUsuarios() {
        const tbody = document.getElementById('users-tbody');
        
        if (!tbody) return;
        
        tbody.innerHTML = this.usuarios.map(user => `
            <tr>
                <td>${user.nome}</td>
                <td>${user.usuario}</td>
                <td>${user.email}</td>
                <td><span class="badge badge-${user.tipo}">${user.tipo}</span></td>
                <td><span class="badge badge-${user.ativo ? 'ativo' : 'inativo'}">${user.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td>${user.ultimoLogin ? new Date(user.ultimoLogin).toLocaleString('pt-BR') : 'Nunca'}</td>
                <td class="acoes">
                    <button class="btn btn-${user.ativo ? 'warning' : 'success'} btn-sm" 
                            onclick="auth.alternarStatusUsuario('${user.id}')" 
                            title="${user.ativo ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${user.ativo ? 'ban' : 'check'}"></i>
                    </button>
                    ${user.tipo !== 'admin' ? `
                        <button class="btn btn-danger btn-sm" 
                                onclick="auth.excluirUsuario('${user.id}')" 
                                title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    // Configurar eventos de usuário
    setupUserEvents() {
        // Formulário de criar usuário
        const createUserForm = document.getElementById('create-user-form');
        if (createUserForm) {
            createUserForm.addEventListener('submit', (e) => this.handleCreateUser(e));
        }
        
        // Formulário de alterar senha
        const changePasswordForm = document.getElementById('change-password-form');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }
    }

    // Handle criar usuário
    handleCreateUser(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const dados = {
            nome: formData.get('nome').trim(),
            usuario: formData.get('usuario').trim(),
            email: formData.get('email').trim(),
            tipo: formData.get('tipo'),
            senha: formData.get('senha'),
            confirmarSenha: formData.get('confirmarSenha')
        };
        
        // Validações
        if (dados.senha !== dados.confirmarSenha) {
            if (window.showToast) window.showToast('As senhas não coincidem.', 'error');
            return;
        }
        
        if (dados.senha.length < 6) {
            if (window.showToast) window.showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        
        const resultado = this.criarUsuario(dados);
        
        if (resultado.success) {
            if (window.showToast) window.showToast('Usuário criado com sucesso!', 'success');
            this.renderizarUsuarios();
            e.target.reset();
            this.showTab('users-list');
        } else {
            if (window.showToast) window.showToast(resultado.message, 'error');
        }
    }

    // Handle alterar senha
    handleChangePassword(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const senhaAtual = formData.get('senhaAtual');
        const novaSenha = formData.get('novaSenha');
        const confirmarNovaSenha = formData.get('confirmarNovaSenha');
        
        // Validações
        if (novaSenha !== confirmarNovaSenha) {
            if (window.showToast) window.showToast('As novas senhas não coincidem.', 'error');
            return;
        }
        
        if (novaSenha.length < 6) {
            if (window.showToast) window.showToast('A nova senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        
        const resultado = this.atualizarSenha(this.usuarioAtual.id, senhaAtual, novaSenha);
        
        if (resultado.success) {
            if (window.showToast) window.showToast(resultado.message, 'success');
            e.target.reset();
        } else {
            if (window.showToast) window.showToast(resultado.message, 'error');
        }
    }

        // Alternar status do usuário (wrapper para evitar conflito de nomes)
    alternarStatusUsuario(usuarioId) {
        const resultado = this._alternarStatusUsuario(usuarioId);
        
        if (resultado.success) {
            if (window.showToast) window.showToast(resultado.message, 'success');
            this.renderizarUsuarios();
        } else {
            if (window.showToast) window.showToast(resultado.message, 'error');
        }
    }

    // Excluir usuário (wrapper para evitar conflito de nomes)
    excluirUsuario(usuarioId) {
        this.usuarioParaExcluir = usuarioId;
        this.abrirModal('confirm-delete-user-modal');
    }

    // Confirmar exclusão de usuário
    confirmarExclusaoUsuario() {
        if (!this.usuarioParaExcluir) return;
        
        const resultado = this._excluirUsuario(this.usuarioParaExcluir);
        
        if (resultado.success) {
            if (window.showToast) window.showToast(resultado.message, 'success');
            this.renderizarUsuarios();
        } else {
            if (window.showToast) window.showToast(resultado.message, 'error');
        }
        
        this.fecharModal('confirm-delete-user-modal');
        this.usuarioParaExcluir = null;
    }

    // Abrir modal
    abrirModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    // Fechar modal
    fecharModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Inicializar sistema de autenticação
let auth;

// Função para inicializar quando o DOM estiver pronto
function inicializarAuth() {
    if (!auth) {
        auth = new AuthSystem();
        window.auth = auth;
    }
}

// Tentar inicializar imediatamente se o DOM já estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAuth);
} else {
    inicializarAuth();
}
