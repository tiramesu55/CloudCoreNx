describe("Basic tests IARX", () => {
    //тестирование IARX

    beforeEach (() => {
        cy.visit("http://localhost:3000/");
        cy.origin("https://iarx-services.oktapreview.com/api/v1/authn/introspect", () => {
            cy.get("input[type='text']").type('cypress@walgreens.com').type('{enter}');
            cy.get("input[type='password']").type('Whiskey+2').type('{enter}')
        });
    })
    
    it ("can add user", () => {
   
        cy.contains("DASHBOARD")
        cy.get('[href="/user"]').click()
        cy.contains("User Name").should('be.visible')
        cy.contains("Organization")
        cy.get('.tss-kj0vea-MUIDataTableToolbar-actions > :nth-child(2)').click()
        cy.get('#outlined-basic').type('TESTUSEROKTA@walgreens.com')
        cy.contains("NEXT").click()
        cy.get('#firstName').type('NewUserTest')
        cy.get('#lastName').type('NewUserTest')
        cy.get('.css-1cukyn2-MuiButtonBase-root-MuiButton-root').click()
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()
        cy.contains('table', "NewUserTest NewUserTest").should('be.visible')
        cy.contains("Organization").should('be.visible')
            .then(() => {
                const token = JSON.parse(localStorage['okta-token-storage']).accessToken.accessToken;
                cy.request({
                    method: 'DELETE',
                    url: 'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/Drop/PlatformUser/testuserokta@walgreens.com',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            })
        cy.reload()
        cy.contains('walgreens').should('be.visible')
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()
        cy.get('table').should('be.visible')
        cy.contains('table', "NewUserTest NewUserTest").should('not.exist')

        cy.get('.MuiAvatar-root').should('be.visible').click()
        cy.get('.MuiList-root > .MuiButtonBase-root').click({ force: true })
        cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
            cy.contains("Sign Off Successful").should('be.visible')
            cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
            });
    });
})