/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Cadastro de usuário', () => {
    beforeEach(() => {
        cy.visit('./')
    })

    it('CT0007 - Validar cadastro de usuário comum', () => {
        const senha = faker.internet.password()
        const usuario = faker.internet.userName()
        cy.login('Admin', 'Admin')
        cy.criaUsuarioComun(usuario, senha)
        cy.get('.toast').should('contain', 'Usuário criado com sucesso!')
    })

    it('CT0003 - Validar cadastro de usuário Administrador', () => {
        const senha = faker.internet.password()
        const usuario = faker.internet.userName()
        cy.login('Admin', 'Admin')
        cy.criaUsuarioAdministrador(usuario, senha)
        cy.get('.toast').should('contain', 'Usuário criado com sucesso!')
    })

    it('CT0004 - Alterar senha do usuário', () => {
        const senha = faker.internet.password()
        const usuario = faker.internet.username()
        const nome = faker.person.fullName()
        const novaSenha = faker.internet.password()
        cy.login('Admin', 'Admin')
        cy.get('.user-dropdown > .btn-secondary').click()
        cy.contains("Criar Usuário").click()
        cy.get('#new-user-nome').type(nome)
        cy.get('#new-user-usuario').type(usuario)
        cy.get('#new-user-email').type(faker.internet.email())
        cy.get('#new-user-tipo').select('Administrador')
        cy.get('#new-user-senha').type(senha)
        cy.get('#new-user-confirmar-senha').type(senha)
        cy.get('#create-user-form > .form-actions > .btn').click()
        cy.get('.toast').should('contain', 'Usuário criado com sucesso!')
        cy.get('#users-modal > .modal-content > .close').click()
        cy.get('.user-dropdown > .btn-danger').click()
        cy.login(usuario, senha)
        cy.get('.user-info').should('contain', nome)
        cy.get('.user-dropdown > .btn-secondary').click()
        cy.contains("Alterar Senha").click()
        cy.get('#current-password').type(senha)
        cy.get('#new-password').type(novaSenha)
        cy.get('#confirm-new-password').type(novaSenha)
        cy.get('#change-password-form > .form-actions > .btn').click()
        cy.get('.toast').should('contain', 'Senha atualizada com sucesso')
        cy.get('#users-modal > .modal-content > .close').click()
        cy.get('.user-dropdown > .btn-danger').click()
        cy.login(usuario, novaSenha)
        cy.get('.user-info').should('contain', nome)


    })
    it('CT0005 - Desativar usuário cadastrado', () => {
        const senha = faker.internet.password()
        const usuario = faker.internet.userName()
        cy.login('Admin', 'Admin')
        cy.criaUsuarioAdministrador(usuario, senha)
        cy.get('.toast').should('contain', 'Usuário criado com sucesso!')
        cy.get(':nth-child(2) > .acoes > .btn').click()
        cy.get('.toast').should('contain', 'Usuário desativado com sucesso')
    })

    it('CT0006 - Ativar usuário cadastrado', () => {
        const senha = faker.internet.password()
        const usuario = faker.internet.userName()
        cy.login('Admin', 'Admin')
        cy.criaUsuarioAdministrador(usuario, senha)
        cy.get('.toast').should('contain', 'Usuário criado com sucesso!')
        cy.get(':nth-child(2) > .acoes > .btn').click()
        cy.get('.toast').should('contain', 'Usuário desativado com sucesso')
        cy.get(':nth-child(2) > .acoes > .btn').click()
        cy.get('.toast').should('contain', 'Usuário ativado com sucesso')
    })
});

