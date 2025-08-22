import { faker } from '@faker-js/faker';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Example of a custom command to login
Cypress.Commands.add('login', (username, password) => {
  cy.get('#usuario').type(username);
  cy.get('#senha').type(password);
  cy.get('.btn').click();
});

Cypress.Commands.add('criaUsuarioComun', () => {
  const senha = faker.internet.password()
  const usuario = faker.internet.userName()
  cy.get('.user-dropdown > .btn-secondary').click()
  cy.contains("Criar Usuário").click()
  cy.get('#new-user-nome').type(faker.person.fullName())
  cy.get('#new-user-usuario').type(usuario)
  cy.get('#new-user-email').type(faker.internet.email())
  cy.get('#new-user-senha').type(senha)
  cy.get('#new-user-confirmar-senha').type(senha)
  cy.get('#create-user-form > .form-actions > .btn').click()

})

Cypress.Commands.add('criaUsuarioAdministrador', () => {
  const senha = faker.internet.password()
  const usuario = faker.internet.userName()
  const nome = faker.person.fullName()
  cy.get('.user-dropdown > .btn-secondary').click()
  cy.contains("Criar Usuário").click()
  cy.get('#new-user-nome').type(nome)
  cy.get('#new-user-usuario').type(usuario)
  cy.get('#new-user-email').type(faker.internet.email())
  cy.get('#new-user-tipo').select('Administrador')
  cy.get('#new-user-senha').type(senha)
  cy.get('#new-user-confirmar-senha').type(senha)
  cy.get('#create-user-form > .form-actions > .btn').click()
});