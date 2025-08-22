// Classe principal da aplicação
class AutoEscolaApp {
    constructor() {
        this.alunos = [];
        this.documentos = [];
        this.alunoSelecionado = null;
        this.editando = false;
        
        this.init();
    }

    init() {
        this.carregarDados();
        this.setupEventListeners();
        // Só renderiza se os elementos existirem (quando a tela principal estiver montada)
        if (document.getElementById('alunos-tbody')) {
            this.renderizarAlunos();
        }
        if (document.getElementById('documentos-lista')) {
            this.renderizarDocumentos();
        }
    }

    // Carregar dados salvos no localStorage
    carregarDados() {
        const alunosSalvos = localStorage.getItem('autoEscolaAlunos');
        const documentosSalvos = localStorage.getItem('autoEscolaDocumentos');
        
        if (alunosSalvos) {
            this.alunos = JSON.parse(alunosSalvos);
        }
        
        if (documentosSalvos) {
            this.documentos = JSON.parse(documentosSalvos);
        }
    }

    // Salvar dados no localStorage
    salvarDados() {
        localStorage.setItem('autoEscolaAlunos', JSON.stringify(this.alunos));
        localStorage.setItem('autoEscolaDocumentos', JSON.stringify(this.documentos));
    }

    // Configurar event listeners
    setupEventListeners() {
        const form = document.getElementById('aluno-form');
        const cancelBtn = document.getElementById('cancel-btn');
        if (!form || !cancelBtn) return;

        // Formulário
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        cancelBtn.addEventListener('click', () => this.cancelarEdicao());
        
        // Upload de documentos
        document.getElementById('documento-upload').addEventListener('change', (e) => this.handleDocumentoUpload(e));
        
        // Busca
        document.getElementById('search-input').addEventListener('input', (e) => this.filtrarAlunos(e.target.value));
        
        // Modais
        this.setupModals();
        
        // Máscaras de input
        this.setupMasks();
    }

    // Configurar máscaras de input
    setupMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });

        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Configurar modais
    setupModals() {
        // Modal de confirmação
        const confirmModal = document.getElementById('confirm-modal');
        const confirmDelete = document.getElementById('confirm-delete');
        const cancelDelete = document.getElementById('cancel-delete');

        confirmDelete.addEventListener('click', () => {
            if (this.alunoSelecionado) {
                this.excluirAluno(this.alunoSelecionado.id);
                this.fecharModal('confirm-modal');
            }
        });

        cancelDelete.addEventListener('click', () => this.fecharModal('confirm-modal'));

        // Modal de visualização
        const viewModal = document.getElementById('view-modal');
        const closeBtn = viewModal.querySelector('.close');
        closeBtn.addEventListener('click', () => this.fecharModal('view-modal'));

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    // Abrir modal
    abrirModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    // Fechar modal
    fecharModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Validar CPF
  validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;
    
    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;
    
    return cpf.charAt(9) == dv1 && cpf.charAt(10) == dv2;
}

    // Validar formulário
    validarFormulario(dados) {
        const erros = {};

        if (!dados.nome || !dados.nome.trim()) {
            erros['nome'] = 'Nome é obrigatório';
        } else if (dados.nome.trim().length < 10) {
            erros['nome'] = 'Nome deve ter pelo menos 10 caracteres';
        }

        if (!dados.cpf || !dados.cpf.trim()) {
            erros['cpf'] = 'CPF é obrigatório';
        } else if (!this.validarCPF(dados.cpf)) {
            erros['cpf'] = 'CPF inválido';
        } else if (!this.editando || (this.alunoSelecionado && this.alunoSelecionado.cpf !== dados.cpf)) {
            const cpfExiste = this.alunos.some(aluno => aluno.cpf === dados.cpf);
            if (cpfExiste) {
                erros['cpf'] = 'CPF já cadastrado';
            }
        }

        if (!dados.telefone || !dados.telefone.trim()) {
            erros['telefone'] = 'Telefone é obrigatório';
        }

        if (!dados.dataNascimento) {
            erros['data-nascimento'] = 'Data de nascimento é obrigatória';
        }

        return erros;
    }

    // Limpar mensagens de erro do formulário
    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    }

    // Definir erro em um campo
    setFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.classList.add('field-error');
        // Evitar duplicar mensagens
        let msg = field.parentElement.querySelector('.error-message');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'error-message';
            field.parentElement.appendChild(msg);
        }
        msg.textContent = message;
    }

    // Gerar ID único
    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Formatar data
    formatarData(data) {
        if (!data) return '';
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR');
    }

    // Formatar CPF
    formatarCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Formatar telefone
    formatarTelefone(telefone) {
        return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }

    // Calcular idade
    calcularIdade(dataNascimento) {
        if (!dataNascimento) return 0;
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }

    // Handle submit do formulário
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const dados = {
            nome: formData.get('nome').trim(),
            cpf: formData.get('cpf').trim(),
            telefone: formData.get('telefone').trim(),
            dataNascimento: formData.get('data-nascimento'),
            categoria: formData.get('categoria'),
            endereco: formData.get('endereco').trim(),
            observacoes: formData.get('observacoes').trim(),
            dataCadastro: this.editando ? this.alunoSelecionado.dataCadastro : new Date().toISOString(),
            status: this.editando ? this.alunoSelecionado.status : 'ativo'
        };
        
        // Validação
        this.clearFormErrors();
        const erros = this.validarFormulario(dados);
        const temErros = Object.keys(erros).length > 0;
        if (temErros) {
            Object.entries(erros).forEach(([fieldId, message]) => this.setFieldError(fieldId, message));
            if (window.showToast) window.showToast('Corrija os campos destacados antes de salvar.', 'error');
            return;
        }
        
        if (this.editando) {
            this.atualizarAluno(dados);
        } else {
            this.cadastrarAluno(dados);
        }
        
        this.limparFormulario();
        this.sairModoEdicao();
    }

    // Cadastrar novo aluno
    cadastrarAluno(dados) {
        const novoAluno = {
            id: this.gerarId(),
            ...dados
        };
        
        this.alunos.push(novoAluno);
        this.salvarDados();
        this.renderizarAlunos();
        
        // Selecionar o novo aluno para documentos
        this.alunoSelecionado = novoAluno;
        this.renderizarDocumentos();
        
        if (window.showToast) window.showToast('Aluno cadastrado com sucesso!', 'success');
    }

    // Atualizar aluno existente
    atualizarAluno(dados) {
        const index = this.alunos.findIndex(aluno => aluno.id === this.alunoSelecionado.id);
        
        if (index !== -1) {
            this.alunos[index] = {
                ...this.alunos[index],
                ...dados,
                id: this.alunoSelecionado.id
            };
            
            this.salvarDados();
            this.renderizarAlunos();
            this.renderizarDocumentos();
            
            if (window.showToast) window.showToast('Aluno atualizado com sucesso!', 'success');
        }
    }

    // Excluir aluno
    excluirAluno(id) {
        const index = this.alunos.findIndex(aluno => aluno.id === id);
        
        if (index !== -1) {
            this.alunos.splice(index, 1);
            
            // Remover documentos do aluno
            this.documentos = this.documentos.filter(doc => doc.alunoId !== id);
            
            this.salvarDados();
            this.renderizarAlunos();
            this.renderizarDocumentos();
            
            if (this.alunoSelecionado && this.alunoSelecionado.id === id) {
                this.alunoSelecionado = null;
            }
            
            if (window.showToast) window.showToast('Aluno excluído com sucesso!', 'success');
        }
    }

    // Editar aluno
    editarAluno(id) {
        const aluno = this.alunos.find(a => a.id === id);
        
        if (aluno) {
            this.alunoSelecionado = aluno;
            this.editando = true;
            this.preencherFormulario(aluno);
            this.alterarTituloFormulario('Editar Aluno');
            this.mostrarBotaoCancelar();
        }
    }

    // Visualizar aluno
    visualizarAluno(id) {
        const aluno = this.alunos.find(a => a.id === id);
        
        if (aluno) {
            this.mostrarDetalhesAluno(aluno);
            this.abrirModal('view-modal');
        }
    }

    // Mostrar detalhes do aluno
    mostrarDetalhesAluno(aluno) {
        const detalhesDiv = document.getElementById('aluno-details');
        const idade = this.calcularIdade(aluno.dataNascimento);
        
        detalhesDiv.innerHTML = `
            <div class="aluno-detail">
                <label>Nome:</label>
                <span>${aluno.nome}</span>
            </div>
            <div class="aluno-detail">
                <label>CPF:</label>
                <span>${this.formatarCPF(aluno.cpf)}</span>
            </div>
            <div class="aluno-detail">
                <label>Telefone:</label>
                <span>${this.formatarTelefone(aluno.telefone)}</span>
            </div>
            <div class="aluno-detail">
                <label>Data de Nascimento:</label>
                <span>${this.formatarData(aluno.dataNascimento)} (${idade} anos)</span>
            </div>
            <div class="aluno-detail">
                <label>Categoria:</label>
                <span>${aluno.categoria || 'Não informada'}</span>
            </div>
            <div class="aluno-detail">
                <label>Endereço:</label>
                <span>${aluno.endereco || 'Não informado'}</span>
            </div>
            <div class="aluno-detail">
                <label>Observações:</label>
                <span>${aluno.observacoes || 'Nenhuma observação'}</span>
            </div>
            <div class="aluno-detail">
                <label>Data de Cadastro:</label>
                <span>${this.formatarData(aluno.dataCadastro)}</span>
            </div>
            <div class="aluno-detail">
                <label>Status:</label>
                <span class="status status-${aluno.status}">${aluno.status}</span>
            </div>
        `;
    }

    // Preencher formulário para edição
    preencherFormulario(aluno) {
        document.getElementById('aluno-id').value = aluno.id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('cpf').value = aluno.cpf;
        document.getElementById('telefone').value = aluno.telefone;
        document.getElementById('data-nascimento').value = aluno.dataNascimento;
        document.getElementById('categoria').value = aluno.categoria || '';
        document.getElementById('endereco').value = aluno.endereco || '';
        document.getElementById('observacoes').value = aluno.observacoes || '';
    }

    // Limpar formulário
    limparFormulario() {
        document.getElementById('aluno-form').reset();
        document.getElementById('aluno-id').value = '';
    }

    // Sair do modo edição
    sairModoEdicao() {
        this.editando = false;
        this.alunoSelecionado = null;
        this.alterarTituloFormulario('Cadastrar Novo Aluno');
        this.ocultarBotaoCancelar();
    }

    // Cancelar edição
    cancelarEdicao() {
        this.limparFormulario();
        this.sairModoEdicao();
    }

    // Alterar título do formulário
    alterarTituloFormulario(titulo) {
        document.getElementById('form-title').textContent = titulo;
    }

    // Mostrar botão cancelar
    mostrarBotaoCancelar() {
        document.getElementById('cancel-btn').style.display = 'inline-flex';
    }

    // Ocultar botão cancelar
    ocultarBotaoCancelar() {
        document.getElementById('cancel-btn').style.display = 'none';
    }

    // Handle upload de documentos
    handleDocumentoUpload(e) {
        if (!this.alunoSelecionado) {
            if (window.showToast) window.showToast('Selecione um aluno primeiro para anexar documentos.', 'warning');
            return;
        }
        
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            const documento = {
                id: this.gerarId(),
                nome: file.name,
                tipo: file.type,
                tamanho: file.size,
                alunoId: this.alunoSelecionado.id,
                dataUpload: new Date().toISOString(),
                arquivo: file
            };
            
            this.documentos.push(documento);
        });
        
        this.salvarDados();
        this.renderizarDocumentos();
        e.target.value = ''; // Limpar input
        
        if (window.showToast) window.showToast(`${files.length} documento(s) anexado(s) com sucesso!`, 'success');
    }

    // Remover documento
    removerDocumento(id) {
        const index = this.documentos.findIndex(doc => doc.id === id);
        
        if (index !== -1) {
            this.documentos.splice(index, 1);
            this.salvarDados();
            this.renderizarDocumentos();
        }
    }

    // Filtrar alunos
    filtrarAlunos(termo) {
        const tbody = document.getElementById('alunos-tbody');
        const linhas = tbody.querySelectorAll('tr');
        
        linhas.forEach(linha => {
            const texto = linha.textContent.toLowerCase();
            const match = texto.includes(termo.toLowerCase());
            linha.style.display = match ? '' : 'none';
        });
    }

    // Renderizar lista de alunos
    renderizarAlunos() {
        const tbody = document.getElementById('alunos-tbody');
        
        if (this.alunos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #718096;">
                        <i class="fas fa-users" style="font-size: 48px; margin-bottom: 15px; display: block; color: #cbd5e0;"></i>
                        Nenhum aluno cadastrado
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.alunos.map(aluno => `
            <tr>
                <td>${aluno.nome}</td>
                <td>${this.formatarCPF(aluno.cpf)}</td>
                <td>${this.formatarTelefone(aluno.telefone)}</td>
                <td>${aluno.categoria || '-'}</td>
                <td><span class="status status-${aluno.status}">${aluno.status}</span></td>
                <td class="acoes">
                    <button class="btn btn-view" onclick="app.visualizarAluno('${aluno.id}')" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-edit" onclick="app.editarAluno('${aluno.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" onclick="app.confirmarExclusao('${aluno.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Renderizar documentos
    renderizarDocumentos() {
        const container = document.getElementById('documentos-lista');
        
        if (!this.alunoSelecionado) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-file-alt" style="font-size: 48px; margin-bottom: 15px; display: block; color: #cbd5e0;"></i>
                    Selecione um aluno para visualizar/gerenciar documentos
                </div>
            `;
            return;
        }
        
        const documentosAluno = this.documentos.filter(doc => doc.alunoId === this.alunoSelecionado.id);
        
        if (documentosAluno.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-file-alt" style="font-size: 48px; margin-bottom: 15px; display: block; color: #cbd5e0;"></i>
                    Nenhum documento anexado para este aluno
                </div>
            `;
            return;
        }
        
        container.innerHTML = documentosAluno.map(doc => `
            <div class="documento-item">
                <div class="documento-info">
                    <i class="fas fa-file-alt"></i>
                    <div>
                        <strong>${doc.nome}</strong>
                        <div style="font-size: 12px; color: #718096;">
                            ${this.formatarTamanho(doc.tamanho)} • ${this.formatarData(doc.dataUpload)}
                        </div>
                    </div>
                </div>
                <div class="documento-acoes">
                    <button class="btn btn-danger" onclick="app.removerDocumento('${doc.id}')" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Formatar tamanho do arquivo
    formatarTamanho(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Confirmar exclusão
    confirmarExclusao(id) {
        this.alunoSelecionado = this.alunos.find(a => a.id === id);
        this.abrirModal('confirm-modal');
    }

    // Selecionar aluno para documentos
    selecionarAlunoParaDocumentos(id) {
        this.alunoSelecionado = this.alunos.find(a => a.id === id);
        this.renderizarDocumentos();
    }
}

// Inicializar aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AutoEscolaApp();
});

// Adicionar funcionalidade de seleção de aluno na tabela
document.addEventListener('click', (e) => {
    if (e.target.closest('.alunos-table tbody tr')) {
        const row = e.target.closest('tr');
        const rows = document.querySelectorAll('.alunos-table tbody tr');
        
        // Remover seleção anterior
        rows.forEach(r => r.classList.remove('selected'));
        
        // Adicionar seleção na linha clicada
        row.classList.add('selected');
        
        // Selecionar aluno para documentos
        const alunoId = row.querySelector('.btn-edit').getAttribute('onclick').match(/'([^']+)'/)[1];
        window.app.selecionarAlunoParaDocumentos(alunoId);
    }
});
