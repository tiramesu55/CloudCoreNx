describe('ui-shared: UserMenu component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=usermenu--primary&args=userMenuProps;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to UserMenu!');
    });
});
