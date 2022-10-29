describe("Basic tests IARX", () => {
    //тестирование IARX

    beforeEach (() => {
        cy.visit("http://localhost:3000/");
        cy.origin("https://iarx-services.oktapreview.com/api/v1/authn/introspect", () => {
        cy.get("input[type='text']").type('cypress@walgreens.com').type('{enter}');
        cy.get("input[type='password']").type('Whiskey+2').type('{enter}')
        });
    })
    
    it ("can change user Data", () => {
        cy.contains("DASHBOARD")
        cy.get('[href="/user"]').click()
        cy.contains("User Name").should('be.visible')
        cy.contains("Organization")
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        cy.contains("TestData TestData").click()
        cy.contains('wag Organization')

        // cy.get('#phoneInput').clear().type('+98 18 4668 4886')
        cy.get('#title').clear().type('TestTitle')
        cy.get('#zipCode').clear().type('ZIPTEST123')
        cy.get('#street').clear().type('StreetTest123')
        cy.get('#city').clear().type('CityTest123')
        cy.get('.css-1cukyn2-MuiButtonBase-root-MuiButton-root').click()

        cy.contains("Organization").should('be.visible')
        cy.get('.tss-kj0vea-MUIDataTableToolbar-actions > :nth-child(2)').should('be.visible')
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        cy.contains("TestData TestData").click()

        // cy.get('#phoneInput').should('have.value', '+98 18 4668 4886').clear().type('+380 123123123')
        cy.get('#title').should('have.value', 'TestTitle').clear().type('BeforeChange')
        cy.get('#zipCode').should('have.value', 'ZIPTEST123').clear().type('BeforeChange')
        cy.get('#street').should('have.value', 'StreetTest123').clear().type('BeforeChange')
        cy.get('#city').should('have.value', 'CityTest123').clear().type('BeforeChange')
        cy.get('.css-1cukyn2-MuiButtonBase-root-MuiButton-root').click()

        cy.get('.tss-kj0vea-MUIDataTableToolbar-actions > :nth-child(2)').should('be.visible')

        cy.get('.MuiAvatar-root').should('be.visible').click()
        cy.get('.MuiList-root > .MuiButtonBase-root').click({ force: true })
            cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
                cy.contains("Sign Off Successful").should('be.visible')
                cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
                });   

    });
})