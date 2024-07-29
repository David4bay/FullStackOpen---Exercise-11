describe('Phonebook App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display a list of persons', () => {
    cy.get('h2').should('contain', 'Phonebook')
    cy.get('ul').should('exist')
    cy.get('ul').children('li').should('have.length.greaterThan', 0)
  }, 400000)

  it('should add a new contact', () => {
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="phoneNumber"]').type('123-456-7890')
    cy.get('button[type="submit"]').contains('add').click()
    cy.get('ul').children('li').should('contain', 'John Doe').and('contain', '123-456-7890')
  }, 400000)

  it('should update a contact', () => {
    cy.get('ul').contains('Arto Hellas').parent().find('button').contains('edit').click()
    cy.get('input[name="name"]').clear().type('Arto H. Updated')
    cy.get('input[name="phoneNumber"]').clear().type('123-456-7891')
    cy.get('button[type="submit"]').contains('update').click()
    cy.get('ul').should('contain', 'Arto H. Updated').and('contain', '123-456-7891')
  }, 400000)

  it('should delete a contact', () => {
    cy.get('ul').contains('John Doe').parent().find('button').contains('delete').click()
    cy.get('ul').should('not.contain', 'John Doe')
  }, 400000)
})