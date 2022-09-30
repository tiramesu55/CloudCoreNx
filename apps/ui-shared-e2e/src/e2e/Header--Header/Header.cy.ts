describe('ui-shared: Header component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=header--primary&args=title;logo;betaIcon;navLinkMenuList;reportIssue;userMenu;userMenuList;'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Header!');
    });
});
