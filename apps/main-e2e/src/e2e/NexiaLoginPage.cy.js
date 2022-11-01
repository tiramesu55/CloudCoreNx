describe("Basic tests IARX", () => {
    //тестирование IARX

    beforeEach (() => {
        cy.visit("http://localhost:3000/platform");
        cy.origin("https://iarx-services.oktapreview.com/api/v1/authn/introspect", () => {
        cy.get("input[type='text']").type('cypress@walgreens.com').type('{enter}');
        cy.get("input[type='password']").type('Whiskey+2').type('{enter}')
        });
        cy.wait(10000)
        cy.visit("http://localhost:3000/platform");
    })

    it ("can log In and Log Out", ()  => {
        cy.contains("Listed Organizations").should('be.visible')
        cy.get('[data-testid="user"]').should('be.visible').click()
        cy.get('[data-testid="Logout"]').click({ force: true })
            cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
                cy.contains("Sign Off Successful").should('be.visible')
                cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
                }); 
        
    }); 
})