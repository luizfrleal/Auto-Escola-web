# TAT-Auto-Escola

Este projeto é uma suíte de testes automatizados para o sistema de Auto Escola, utilizando [Cypress](https://www.cypress.io/) para testes end-to-end e [@faker-js/faker](https://github.com/faker-js/faker) para geração de dados dinâmicos. Também utiliza [cpf-cnpj-validator](https://www.npmjs.com/package/cpf-cnpj-validator) para geração e validação de CPFs válidos.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/TAT-Auto-Escola.git
   cd TAT-Auto-Escola
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```
   ou
   ```sh
   yarn install
   ```

## Estrutura dos Testes

Os testes estão localizados na pasta:
```
cypress/e2e/
```
Principais arquivos de teste:
- `Login.cy.js` — Testes de login
- `CadastroDeUsuarios.cy.js` — Testes de cadastro e gerenciamento de usuários
- `cadastroDeAlunos.cy.js` — Testes de cadastro, edição e exclusão de alunos

## Comandos Úteis

- Executar os testes no modo interativo:
  ```sh
  npx cypress open
  ```
- Executar os testes no modo headless:
  ```sh
  npx cypress run
  ```

## Geração de Dados

- **Faker:** Utilizado para gerar nomes, e-mails, telefones, datas e outros dados fictícios.
- **CPF:** Utilizado o pacote `cpf-cnpj-validator` para garantir CPFs válidos e aceitos pelo sistema.

## Observações

- Certifique-se de que a aplicação da Auto Escola esteja rodando localmente antes de executar os testes.
- Os testes utilizam comandos customizados Cypress, como `cy.login` e `cy.criaUsuarioAdministrador`.

## Contribuição

Pull requests são bem-vindos! Para mudanças maiores, por favor abra uma issue primeiro para discutir o que você gostaria de mudar.

---

**Desenvolvido por [Seu Nome