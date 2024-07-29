describe('Phonebook App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display a list of persons', () => {
    cy.get('h2').should('contain', 'Phonebook')
    cy.get('ul').should('exist')
    cy.get('ul').children('li').should('have.length.greaterThan', 0)
  })

  it('should add a new contact', () => {
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="phoneNumber"]').type('123-456-7890')
    cy.get('button[type="submit"]').contains('add').click()
    cy.get('ul').children('li').should('contain', 'John Doe').and('contain', '123-456-7890')
  })

  it('should delete a contact', () => {
    cy.get('ul').contains('John Doe').find('button').contains('delete').click()
    cy.get('ul').should('not.contain', 'John Doe')
  })

   after(() => {
    cy.request('DELETE', '/api/persons')
      .then((response) => {
        expect(response.status).to.eq(204); // Check if the status code is 204 No Content
        expect(response.body).to.be.empty; // Ensure the body is empty
      });
  });
})