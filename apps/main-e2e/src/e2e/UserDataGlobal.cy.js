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

    it ("can change User Data", ()  => {
        cy.contains("DASHBOARD")

        //Create User
        cy.get('[href="/platform/user"]').click()
        cy.contains("User Name").should('be.visible')
        cy.contains("Organization")
        cy.get('[data-testid="addnewuser"]').click()
        cy.get('input').type('UserDataTestGlobal@walgreens.com')
        cy.get('[data-testid="next"]').click()
        cy.get('#firstName').type('BeforeChange')
        cy.get('#lastName').type('BeforeChange')
        cy.get('[data-testid="save"]').click()
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        //Change Name
        cy.contains("BeforeChange BeforeChange").click()
        cy.get('#firstName').clear().type("Changed to new name")
        cy.get('#lastName').clear().type("Changed to new lastname")

        //Change Data
        // cy.get('#phoneInput').clear().type('+98 18 4668 4886')
        cy.get('#title').clear().type('TestTitle')
        cy.get('#zipCode').clear().type('ZIPTEST123')
        cy.get('#street').clear().type('StreetTest123')
        cy.get('#city').clear().type('CityTest123')

        //change Applications
        cy.contains("ERV").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.contains("Select All").click()
        cy.contains("ERV").should('be.visible')
        .next().should('contain', 'pharmacist').next().should('contain', 'Sites').click()
        cy.contains("Select All").click()
        cy.contains("Analytics").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.contains("Select All").click()
        cy.contains("Analytics").should('be.visible')
        .next().should('contain', 'exec').next().should('contain', 'Sites').contains('Sites').click()
        cy.contains("Select All").click()
        cy.contains("Platform Management").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.contains("Select All").click()
        cy.contains("Marketplace").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.contains("Select All").click()
        cy.contains("Marketplace").should('be.visible')
        .next().should('contain', 'owner').next().should('contain', 'Sites').contains('Sites').click()
        cy.contains("Select All").click()

        cy.get('[data-testid="updateuser"]').click()
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()


        //Assert
        cy.contains("Changed to new name Changed to new lastname")
        .parents('tr')
        .contains('erv, analytics, admin, marketplace')
        cy.contains("Changed to new name Changed to new lastname").click()

        //Change Back Name
        cy.get('#firstName').clear().type("BeforeChange")
        cy.get('#lastName').clear().type("BeforeChange")

        //Change Back Data
        // cy.get('#phoneInput').should('have.value', '+98 18 4668 4886').clear().type('+380 123123123')
        cy.get('#title').should('have.value', 'TestTitle').clear().type('BeforeChange')
        cy.get('#zipCode').should('have.value', 'ZIPTEST123').clear().type('BeforeChange')
        cy.get('#street').should('have.value', 'StreetTest123').clear().type('BeforeChange')
        cy.get('#city').should('have.value', 'CityTest123').clear().type('BeforeChange')

        //Change Back Applications +Assert
        cy.contains("ERV").should('be.visible')
        .next().should('contain', 'pharmacist').click()
        cy.contains("Select All").click()
        cy.contains("ERV").should('be.visible')
        .next().should('contain', 'Roles').next().click()
        cy.contains("Select All").click()
        cy.contains("Analytics").should('be.visible')
        .next().should('contain', 'exec').contains("exec").click()
        cy.contains("Select All").click()
        cy.contains("Analytics").should('be.visible')
        .next().should('contain', 'Roles').next().contains('NorthLake, Tolleson, Memphis').click()
        cy.contains("Select All").click()
        cy.contains("Platform Management").should('be.visible')
        .next().should('contain', 'organization').contains('organization').click()
        cy.contains("Select All").click()
        cy.contains("Marketplace").should('be.visible')
        .next().should('contain', 'owner').contains('owner').click()
        cy.contains("Select All").click()
        cy.contains("Marketplace").should('be.visible')
        .next().should('contain', 'Roles').next().should('contain', 'Sites').contains('Sites').click()
        cy.contains("Select All").click()

        cy.get('[data-testid="updateuser"]').click()
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        //Assert
        cy.contains("BeforeChange BeforeChange")
        .parents('tr')
        .contains('erv, analytics, admin, marketplace').should('not.exist')  


       //Delete User
       cy.contains('table', "BeforeChange BeforeChange")
        cy.contains("Organization").should('be.visible')
            .then(() => {
                const token = JSON.parse(localStorage['okta-token-storage']).accessToken.accessToken;
                cy.request({
                    method: 'DELETE',
                    url: 'https://apim-nexiacc-dev-eastus2-a5efee35.azure-api.net/platform-api/Drop/PlatformUser/UserDataTestGlobal@walgreens.com',
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
        cy.contains('table', "BeforeChange BeforeChange").should('not.exist')

        //Logout
        cy.get('[data-testid="user"]').should('be.visible').click()
        cy.get('[data-testid="Logout"]').click({ force: true })
            cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
                cy.contains("Sign Off Successful").should('be.visible')
                cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
                });

    }); 
})