/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import { cpf as cpfValidator } from 'cpf-cnpj-validator'

describe('Cadastro de Aluno', () => {

    beforeEach(() => {
        cy.visit('./')
    })

    it('CT0014 - Validar cadastro de aluno com sucesso', () => {
        const nome = faker.person.fullName()
        const cpf = cpfValidator.generate()
        const telefone = faker.phone.number('##-#####-####')
        const dataNascimento = faker.date
            .birthdate({ min: 18, max: 60, mode: 'age' })
            .toISOString()
            .split('T')[0]
        cy.login('Admin', 'Admin')
        cy.get('#nome').type(nome)
        cy.get('#cpf').type(cpf)
        cy.get('#telefone').type(telefone)
        cy.get('#data-nascimento').type(dataNascimento)
        cy.get('#categoria').select('A')
        cy.get('#endereco').type(faker.location.streetAddress())
        cy.get('#submit-btn').click()
        cy.get('.toast').should('contain', 'Aluno cadastrado com sucesso!')
    })


    it('CT0015 - Validar Edição de aluno com sucesso', () => {
        const nome = faker.person.fullName()
        const cpf = cpfValidator.generate()
        const email = faker.internet.email()
        const telefone = faker.phone.number('##-#####-####')
        const dataNascimento = faker.date
            .birthdate({ min: 18, max: 60, mode: 'age' })
            .toISOString()
            .split('T')[0]

        cy.login('Admin', 'Admin')
        cy.get('#nome').type(nome)
        cy.get('#cpf').type(cpf)
        cy.get('#telefone').type(telefone)
        cy.get('#data-nascimento').type(dataNascimento)
        cy.get('#categoria').select('A')
        cy.get('#endereco').type(faker.location.streetAddress())
        cy.get('#submit-btn').click()
        cy.get('.toast').should('contain', 'Aluno cadastrado com sucesso!')
        cy.get('.btn-edit').click()
        cy.get('#endereco').type(faker.location.streetAddress())
        cy.get('#submit-btn').click()
        cy.get('.toast').should('contain', 'Aluno atualizado com sucesso!')


    })

    it('CT0016 - Validar Delete de aluno com sucesso', () => {
        const nome = faker.person.fullName()
        const cpf = cpfValidator.generate()
        const email = faker.internet.email()
        const telefone = faker.phone.number('##-#####-####')
        const dataNascimento = faker.date
            .birthdate({ min: 18, max: 60, mode: 'age' })
            .toISOString()
            .split('T')[0]

        cy.login('Admin', 'Admin')
        cy.get('#nome').type(nome)
        cy.get('#cpf').type(cpf)
        cy.get('#telefone').type(telefone)
        cy.get('#data-nascimento').type(dataNascimento)
        cy.get('#categoria').select('A')
        cy.get('#endereco').type(faker.location.streetAddress())
        cy.get('#submit-btn').click()
        cy.get('.toast').should('contain', 'Aluno cadastrado com sucesso!')
        cy.get('.btn-delete > .fas').click()
        cy.get('#confirm-delete').click()
        cy.get('.toast').should('contain', 'Aluno excluído com sucesso!')


    })
});