const site_url =  Cypress.env('site_url'); 
describe('Basic tests IARX', () => {
  it('Create, Activate/Deactivate and Delete User', () => {
    cy.visit(`${site_url}/platform`, {
      failOnStatusCode: false,
      timeout: 30000,
    });
    cy.origin(
      'https://iarx-services.oktapreview.com/api/v1/authn/introspect',
      () => {
        cy.get("input[type='text']").type('devadmin@dev.com').type('{enter}');
        cy.get("input[type='password']").type('Whiskey+3').type('{enter}');
      }
    );
    // cy.wait(10000);
    cy.contains('Dashboard');

    //Create User
    cy.get('[href="/platform/user"]')
      .click()
      .then(() => {
        const token = sessionStorage['okta-token-storage']
          ? JSON.parse(sessionStorage['okta-token-storage']).accessToken
              .accessToken
          : '';
        cy.request({
          failOnStatusCode: false,
          method: 'DELETE',
          url: 'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/Drop/PlatformUser/UserActivationTest@dev.com',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      });

    cy.contains('User Name').should('be.visible');
    cy.contains('Organization');
    cy.get('[data-testid="addnewuser"]').click();
    cy.get('[data-testid="emailid"]').type('UserActivationTest@dev.com');
    cy.get('[data-testid="next"]').click();
    cy.get('#firstName').type('UserActivationTest');
    cy.get('#lastName').type('UserActivationTest');
    cy.get('#title').clear().type('TitleActivation');
    cy.get('[data-testid="save"]').click();
    cy.get('[data-testid="pagination-rows"]').click();
    cy.get('[data-value="100"]').click();
    cy.contains('TitleActivation')
      .parents('tr')
      .contains('Active')
      .then(($activeUserButton) => {
        const userButtonText = $activeUserButton.text();

        if (userButtonText === 'Not Active') {
          throw Error(
            'Something went wrong. User is deactivated right after creation'
          );
        } else {
          cy.log('User is Active');
          cy.contains('UserActivationTest UserActivationTest').click();
          cy.get('[data-testid="activeuser"]').click();
          cy.get('button').contains('Cancel').next().click();
          cy.get('[data-testid="pagination-rows"]').click();
          cy.get('[data-value="100"]').click();
          cy.contains('TitleActivation').parents('tr').contains('Not Active');
        }

        cy.contains('TitleActivation')
          .parents('tr')
          .contains('Active')
          .then(($activeUserButton) => {
            const userButtonText = $activeUserButton.text();

            if (userButtonText === 'Not Active') {
              cy.log('User is Not Active');
              cy.contains('UserActivationTest UserActivationTest').click();
              cy.get('[data-testid="activeuser"]').click();
              cy.get('button').contains('Cancel').next().click();
              cy.get('[data-testid="pagination-rows"]').click();
              cy.get('[data-value="100"]').click();
              cy.contains('TitleActivation')
                .parents('tr')
                .contains('Not')
                .should('not.exist');
            } else {
              throw Error('Something went wrong. User is still active');
            }
          });

        //Delete User
        cy.contains('table', 'UserActivationTest UserActivationTest');
        cy.contains('Organization')
          .should('be.visible')
          .then(() => {
            const token = JSON.parse(sessionStorage['okta-token-storage'])
              .accessToken.accessToken;
            cy.request({
              failOnStatusCode: false,
              method: 'DELETE',
              url: 'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/Drop/PlatformUser/UserActivationTest@dev.com',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          });
        cy.reload();
        cy.contains('dev').should('be.visible');
        cy.get('[data-testid="pagination-rows"]').click();
        cy.get('[data-value="100"]').click();
        cy.get('table').should('be.visible');
        cy.contains('table', 'UserActivationTest UserActivationTest').should(
          'not.exist'
        );

        //logout
        cy.get('[data-testid="user"]').should('be.visible').click();
        cy.get('[data-testid="Logout"]').click({ force: true });
        cy.origin('https://ssotest.walgreens.com/idp/idpLogout', () => {
          cy.contains('Sign Off Successful').should('be.visible');
          cy.url().should(
            'contains',
            'https://ssotest.walgreens.com/idp/idpLogout'
          );
        });
      });
  });
});
