describe("Basic tests IARX", () => {
    //тестирование IARX
    beforeEach (() => {
        cy.visit("http://localhost:3000/");
        cy.origin("https://iarx-services.oktapreview.com/api/v1/authn/introspect", () => {
        cy.get("input[type='text']").type('cypress@walgreens.com').type('{enter}');
        cy.get("input[type='password']").type('Whiskey+2').type('{enter}')
        });
    })
    
    it ("can activate User", () => {
        cy.contains("DASHBOARD")
        cy.get('[href="/user"]').click()
        cy.contains("User Name").should('be.visible')
        cy.contains("Organization")
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()
        cy.contains("TitleActivation")
        .parents('tr')
        .contains('Active')
        .then(($activeUserButton) => {
            const userButtonText = $activeUserButton.text()

            if (userButtonText == 'Not Active') {
                cy.log("User is Not Active")
                cy.contains("UserActivationTest UserActivationTest").click()
                cy.get(':nth-child(1) > .MuiButton-root').click()
                cy.get('.MuiButton-contained').click()
                cy.get('[data-testid="pagination-rows"]').click()
                cy.get('[data-value="100"]').click()
                cy.contains("TitleActivation")
                .parents('tr')
                .contains('Not').should('not.exist')
            }
            else {
                cy.log("User is Active")
                cy.contains("UserActivationTest UserActivationTest").click()
                cy.get(':nth-child(1) > .MuiButton-root').click()
                cy.get('.MuiButton-contained').click()
                cy.get('[data-testid="pagination-rows"]').click()
                cy.get('[data-value="100"]').click()
                cy.contains("TitleActivation")
                .parents('tr')
                .contains('Not Active')
            }

        cy.contains("TitleActivation")
        .parents('tr')
        .contains('Active')
        .then(($activeUserButton) => {
            const userButtonText = $activeUserButton.text()

            if (userButtonText == 'Not Active') {
                cy.log("User is Not Active")
                cy.contains("UserActivationTest UserActivationTest").click()
                cy.get(':nth-child(1) > .MuiButton-root').click()
                cy.get('.MuiButton-contained').click()
                cy.get('[data-testid="pagination-rows"]').click()
                cy.get('[data-value="100"]').click()
                cy.contains("TitleActivation")
                .parents('tr')
                .contains('Not').should('not.exist')
            }
            else {
                cy.log("User is Active")
                cy.contains("UserActivationTest UserActivationTest").click()
                cy.get(':nth-child(1) > .MuiButton-root').click()
                cy.get('.MuiButton-contained').click()
                cy.get('[data-testid="pagination-rows"]').click()
                cy.get('[data-value="100"]').click()
                cy.contains("TitleActivation")
                .parents('tr')
                .contains('Not Active')
            }
        })

    cy.get('.MuiAvatar-root').should('be.visible').click()
    cy.get('.MuiList-root > .MuiButtonBase-root').click({ force: true })
        cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
            cy.contains("Sign Off Successful").should('be.visible')
            cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
            });       
        })
    });
})