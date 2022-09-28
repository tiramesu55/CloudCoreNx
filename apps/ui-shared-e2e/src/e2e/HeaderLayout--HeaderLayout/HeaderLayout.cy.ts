describe('ui-shared: HeaderLayout component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=headerlayout--primary&args=title;signOut;children;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to HeaderLayout!');
    });
});
