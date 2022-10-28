describe("Basic tests IARX", () => {
    //тестирование IARX

    beforeEach (() => {
        cy.visit("http://localhost:3000/");
        cy.origin("https://iarx-services.oktapreview.com/api/v1/authn/introspect", () => {
        cy.get("input[type='text']").type('cypress@walgreens.com').type('{enter}');
        cy.get("input[type='password']").type('Whiskey+2').type('{enter}')
        });
    })
    
    it ("can change Name", () => {
        cy.contains("DASHBOARD")
        cy.get('[href="/user"]').click()
        cy.contains("User Name").should('be.visible')
        cy.contains("Organization")
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        cy.contains("TestData TestData").click()
        cy.get('#firstName').clear().type("Changed to new name")
        cy.get('#lastName').clear().type("Changed to new lastname")
        cy.get('.css-1cukyn2-MuiButtonBase-root-MuiButton-root').click()

        cy.contains("Organization").should('be.visible')
        cy.contains("Changed to new name")
        .parents('tr')
        .contains('Changed to new lastname')

        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        cy.contains("Changed to new name").click()
        cy.get('#firstName').clear().type("TestData")
        cy.get('#lastName').clear().type("TestData")
        cy.get('.css-1cukyn2-MuiButtonBase-root-MuiButton-root').click()
        cy.contains("Organization").should('be.visible')
        
        
        cy.get('.MuiAvatar-root').should('be.visible').click()
        cy.get('.MuiList-root > .MuiButtonBase-root').click({ force: true })
            cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
                cy.contains("Sign Off Successful").should('be.visible')
                cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
                });   
    });
})