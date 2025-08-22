// Dados de exemplo para a aplicação Auto Escola
// Este arquivo pode ser usado para popular a aplicação com dados de teste

const dadosExemplo = {
    alunos: [
        {
            id: "exemplo1",
            nome: "João Silva Santos",
            cpf: "123.456.789-01",
            telefone: "(11) 99999-9999",
            dataNascimento: "1990-05-15",
            categoria: "B",
            endereco: "Rua das Flores, 123 - São Paulo/SP",
            observacoes: "Aluno dedicado, sempre pontual nas aulas",
            dataCadastro: "2024-01-15T10:00:00.000Z",
            status: "ativo"
        },
        {
            id: "exemplo2",
            nome: "Maria Oliveira Costa",
            cpf: "987.654.321-00",
            telefone: "(11) 88888-8888",
            dataNascimento: "1985-12-20",
            categoria: "AB",
            endereco: "Av. Paulista, 1000 - São Paulo/SP",
            observacoes: "Precisa de mais prática em baliza",
            dataCadastro: "2024-01-10T14:30:00.000Z",
            status: "ativo"
        },
        {
            id: "exemplo3",
            nome: "Pedro Almeida Lima",
            cpf: "456.789.123-45",
            telefone: "(11) 77777-7777",
            dataNascimento: "1995-08-03",
            categoria: "A",
            endereco: "Rua Augusta, 500 - São Paulo/SP",
            observacoes: "Excelente aluno, já pode fazer o exame",
            dataCadastro: "2024-01-05T09:15:00.000Z",
            status: "ativo"
        }
    ],
    documentos: [
        {
            id: "doc1",
            nome: "RG - João Silva.pdf",
            tipo: "application/pdf",
            tamanho: 1024000,
            alunoId: "exemplo1",
            dataUpload: "2024-01-15T10:30:00.000Z"
        },
        {
            id: "doc2",
            nome: "CPF - João Silva.pdf",
            tipo: "application/pdf",
            tamanho: 512000,
            alunoId: "exemplo1",
            dataUpload: "2024-01-15T10:35:00.000Z"
        },
        {
            id: "doc3",
            nome: "Foto 3x4 - Maria Costa.jpg",
            tipo: "image/jpeg",
            tamanho: 256000,
            alunoId: "exemplo2",
            dataUpload: "2024-01-10T15:00:00.000Z"
        }
    ]
};

// Função para carregar dados de exemplo
function carregarDadosExemplo() {
    if (window.showToast) {
        window.showToast('Dados de exemplo carregados com sucesso!', 'success');
    }
    
    // Salvar no localStorage
    localStorage.setItem('autoEscolaAlunos', JSON.stringify(dadosExemplo.alunos));
    localStorage.setItem('autoEscolaDocumentos', JSON.stringify(dadosExemplo.documentos));
    
    // Recarregar a página para aplicar os dados
    location.reload();
}

// Função para limpar todos os dados
function limparTodosDados() {
    if (window.showToast) {
        window.showToast('Todos os dados foram removidos.', 'warning');
    }
    
    localStorage.removeItem('autoEscolaAlunos');
    localStorage.removeItem('autoEscolaDocumentos');
    location.reload();
}

// Função para exportar dados
function exportarDados() {
    const dados = {
        alunos: JSON.parse(localStorage.getItem('autoEscolaAlunos') || '[]'),
        documentos: JSON.parse(localStorage.getItem('autoEscolaDocumentos') || '[]'),
        dataExportacao: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auto-escola-dados-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Função para importar dados
function importarDados() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const dados = JSON.parse(e.target.result);
                    
                    if (dados.alunos && dados.documentos) {
                        if (window.showToast) {
                            window.showToast('Dados importados com sucesso!', 'success');
                        }
                        localStorage.setItem('autoEscolaAlunos', JSON.stringify(dados.alunos));
                        localStorage.setItem('autoEscolaDocumentos', JSON.stringify(dados.documentos));
                        location.reload();
                    } else {
                        if (window.showToast) {
                            window.showToast('Arquivo inválido. Formato esperado: alunos e documentos.', 'error');
                        }
                    }
                } catch (error) {
                    if (window.showToast) {
                        window.showToast('Erro ao ler arquivo: ' + error.message, 'error');
                    }
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Adicionar botões de utilidade ao console (para desenvolvedores)
console.log(`
🚗 Auto Escola - Sistema de Gestão de Alunos

📋 Funções disponíveis no console:
• carregarDadosExemplo() - Carrega dados de exemplo
• limparTodosDados() - Remove todos os dados
• exportarDados() - Exporta dados para arquivo JSON
• importarDados() - Importa dados de arquivo JSON

💡 Dica: Use estas funções para testar a aplicação!
`);

// Expor funções globalmente para uso no console
window.carregarDadosExemplo = carregarDadosExemplo;
window.limparTodosDados = limparTodosDados;
window.exportarDados = exportarDados;
window.importarDados = importarDados;
