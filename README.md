# Auto Escola - Sistema de Gestão de Alunos

Sistema web para gestão de alunos de autoescola, com cadastro, documentos, controle de usuários e validação de CPF. Desenvolvido em JavaScript puro, interface responsiva e testes automatizados com Cypress e K6. Armazenamento local no navegador.

---

## 🚀 Funcionalidades da Aplicação

### 🔐 Sistema de Autenticação
- Tela de login com validação de usuário e senha
- Usuário padrão: Admin / Admin
- Gestão de usuários com diferentes tipos (admin/usuário)
- Controle de acesso baseado em permissões

### ✅ Gestão de Alunos
- Cadastrar, editar, excluir e visualizar alunos
- Busca e filtros por nome, CPF ou telefone

### 📋 Dados dos Alunos
- Nome completo, CPF (com validação), telefone (com máscara), data de nascimento, categoria da CNH, endereço, observações, status, data de cadastro

### 📎 Gestão de Documentos
- Anexar, visualizar e remover documentos por aluno
- Suporte a múltiplos formatos (PDF, imagens, documentos)

### 👥 Gestão de Usuários
- Criar, ativar/desativar, alterar senha e excluir usuários (exceto administradores)

### 🎨 Interface Moderna
- Design responsivo, animações, ícones FontAwesome, gradientes, sombras e modais

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Flexbox e Grid
- **JavaScript ES6+** - Lógica orientada a objetos
- **FontAwesome** - Ícones
- **LocalStorage** - Armazenamento local dos dados

---

## 📁 Estrutura do Projeto

```
Auto-Escola/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── app.js
│   └── dados-exemplo.js
├── cypress/
│   └── e2e/
│       ├── Login.cy.js
│       ├── CadastroDeUsuarios.cy.js
│       ├── cadastroDeAlunos.cy.js
│       └── README.md
├── tests/
│   └── Performance/
│       └── login.test.js
├── package.json
└── README.md
```

---

## 🚀 Como Executar a Aplicação

### Opção 1: Servidor Local (Recomendado)
1. Instale as dependências:
   ```sh
   npm install
   ```
2. Execute o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```
3. Acesse `http://localhost:3000` no navegador.

### Opção 2: Abrir Diretamente
1. Abra o arquivo `index.html` em qualquer navegador moderno.
2. **Nota:** Algumas funcionalidades podem não funcionar corretamente devido a restrições de segurança do navegador.

---

## 🧪 Testes Automatizados

Este projeto inclui uma suíte de testes automatizados utilizando [Cypress](https://www.cypress.io/) para testes end-to-end e [K6](https://k6.io/) para testes de performance.

### Cypress (E2E)

#### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

#### Instalação dos Testes

1. Instale as dependências:
   ```sh
   npm install
   ```
   ou
   ```sh
   yarn install
   ```

#### Estrutura dos Testes

Os testes estão localizados em:
```
cypress/e2e/
```
Principais arquivos:
- `Login.cy.js` — Testes de login
- `CadastroDeUsuarios.cy.js` — Testes de cadastro e gerenciamento de usuários
- `cadastroDeAlunos.cy.js` — Testes de cadastro, edição e exclusão de alunos

#### Comandos Úteis

- Executar os testes no modo interativo:
  ```sh
  npx cypress open
  ```
- Executar os testes no modo headless:
  ```sh
  npx cypress run
  ```
### 📂 Cypress Custom Commands (`cypress/support/commands.js`)

O arquivo `commands.js` contém comandos customizados do Cypress para facilitar e padronizar ações repetitivas nos testes automatizados.

Principais comandos disponíveis:

- `cy.login(usuario, senha)`: Faz login na aplicação preenchendo o formulário de login.
- `cy.criaUsuarioComun()`: Cria um novo usuário comum com dados gerados automaticamente.
- `cy.criaUsuarioAdministrador()`: Cria um novo usuário administrador com dados gerados automaticamente.

Esses comandos tornam os testes mais legíveis, reutilizáveis e fáceis de manter.  
Para utilizá-los, basta chamar o comando desejado dentro do seu teste, por exemplo:

```javascript
cy.login('Admin', 'Admin');
cy.criaUsuarioComun();
cy.criaUsuarioAdministrador();
```

O Cypress carrega automaticamente o arquivo `commands.js` antes de executar os testes.

#### Geração de Dados

- **Faker:** Para gerar nomes, e-mails, telefones, datas e outros dados fictícios.
- **CPF:** Utiliza o pacote `cpf-cnpj-validator` para garantir CPFs válidos.

#### Observações

- Certifique-se de que a aplicação esteja rodando localmente antes de executar os testes.
- Os testes utilizam comandos customizados Cypress, como `cy.login` e `cy.criaUsuarioAdministrador`.

---

### K6 (Performance)

#### Pré-requisitos

- [K6](https://k6.io/docs/getting-started/installation/)

#### Execução

1. Certifique-se de que a aplicação está rodando em `http://localhost:3000`.
2. Execute o teste de performance:
   ```sh
   k6 run tests/Performance/login.test.js
   ```

---

## 📱 Como Usar a Aplicação

1. Faça login com **Usuário:** Admin | **Senha:** Admin
2. Utilize o menu para gerenciar usuários, alunos e documentos conforme as instruções na interface.

---

## 🔧 Características Técnicas

- **Validações:** CPF, campos obrigatórios, CPF único, máscaras automáticas
- **Armazenamento:** LocalStorage, estrutura JSON, backup automático
- **Responsividade:** Mobile-first, breakpoints, touch-friendly

---

## 🚨 Limitações

- Dados ficam apenas no navegador atual
- Sem backup automático externo
- Sem sincronização entre dispositivos
- Documentos limitados pelo navegador

---

## 🆘 Suporte

- Formulário não envia: verifique campos obrigatórios
- CPF inválido: confira o número digitado
- Documentos não anexam: selecione um aluno antes
- Dados não salvam: verifique se o localStorage está habilitado

---

## 📝 Licença

Este projeto é de uso livre para fins educacionais e de teste.

---

**Desenvolvido por Luiz Fernando Leal para exercitar conhecimentos em testes de software** 🧪
