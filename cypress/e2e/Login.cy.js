describe('Funcionalidade Login', () => {
  beforeEach(() => {
    cy.visit('./')
  })

  it('CT0001 - Validar Login com sucesso!', () => {
    cy.login('Admin', 'Admin')
    cy.get('.user-info').should('contain', 'Admin')
  })

  it('CT0002 - Validar Login com falha!', () => {
    cy.login('Admin', '2154')
    cy.get('.toast').should('contain', 'Usuário ou senha inválidos')
  })
})