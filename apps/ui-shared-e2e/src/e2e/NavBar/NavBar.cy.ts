describe('ui-shared: NavBar component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=navbar--primary&args=navigationProps;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to NavBar!');
    });
});
