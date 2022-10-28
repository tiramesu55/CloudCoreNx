describe("Basic tests IARX", () => {
    //тестирование IARX

    beforeEach (() => {
        cy.visit("http://localhost:3000/");
        cy.origin("https://iarx-services.oktapreview.com/api/v1/authn/introspect", () => {
        cy.get("input[type='text']").type('cypress@walgreens.com').type('{enter}');
        cy.get("input[type='password']").type('Whiskey+2').type('{enter}')
        });
    })

    it ("can log In and Log Out", ()  => {
        cy.contains("Listed Organizations").should('be.visible')
        cy.get('.MuiAvatar-root').click()
        cy.get('.MuiList-root > .MuiButtonBase-root').click({ force: true })
        cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
            cy.contains("Sign Off Successful").should('be.visible')
            cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
            });
        
    }); 
})