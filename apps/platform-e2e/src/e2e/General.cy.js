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
        cy.get('.MuiAvatar-root').should('be.visible').click()
        cy.get('.MuiList-root > .MuiButtonBase-root').should('be.visible').click({ force: true })
        cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
            cy.contains("Sign Off Successful").should('be.visible')
            cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
            });
        
    }); 

    it ("can visit Users page", () => {
        cy.contains("DASHBOARD")
        cy.get('[href="/user"]').click()
        cy.contains("User Name").should('be.visible')
        cy.contains("Organization")
        cy.contains("User Name").should('be.visible')
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        cy.get('.MuiAvatar-root').should('be.visible').click()
        cy.get('.MuiList-root > .MuiButtonBase-root').should('be.visible').click({ force: true })
            cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
                cy.contains("Sign Off Successful").should('be.visible')
                cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
                });   
    });

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

    it ("can change user Applications", () => {
        cy.contains("DASHBOARD")
        cy.get('[href="/user"]').click()
        cy.contains("User Name").should('be.visible')
        cy.contains("Organization")
        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()

        cy.contains("TestData TestData").click()

        // Change ERV
        cy.contains("ERV").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()

        cy.contains("ERV").should('be.visible')
        .next().should('contain', 'pharmacist').next().should('contain', 'Sites').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()
        // Change Analytics
        cy.contains("Analytics").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()

        cy.contains("Analytics").should('be.visible')
        .next().should('contain', 'exec').next().should('contain', 'Sites').contains('Sites').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()
        // Change Platform Management
        cy.contains("Platform Management").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()
        // Marketplace
        cy.contains("Marketplace").should('be.visible')
        .next().should('contain', 'Roles').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()

        cy.contains("Marketplace").should('be.visible')
        .next().should('contain', 'owner').next().should('contain', 'Sites').contains('Sites').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()






        cy.get('.css-1cukyn2-MuiButtonBase-root-MuiButton-root').click()

        cy.get('[data-testid="pagination-rows"]').click()
        cy.get('[data-value="100"]').click()


        cy.contains("TestData TestData")
        .parents('tr')
        .contains('erv, analytics, admin, marketplace')
        cy.contains("TestData TestData").click()






      // Change ERV
      cy.contains("ERV").should('be.visible')
      .next().should('contain', 'pharmacist').click()
      cy.contains("Select All").click()
      cy.contains("ERV").should('be.visible')
      .next().should('contain', 'Roles').next().click()
      cy.contains("Select All").click()



      // Change Analytics
      cy.contains("Analytics").should('be.visible')
      .next().should('contain', 'exec').contains("exec").click()
      cy.contains("Select All").click()

      cy.contains("Analytics").should('be.visible')
      .next().should('contain', 'Roles').next().contains('NorthLake, Tolleson, Memphis').click()
      cy.contains("Select All").click()



      // Change Platform Management
      cy.contains("Platform Management").should('be.visible')
      .next().should('contain', 'organization').contains('organization').click()
      cy.contains("Select All").click()



      // Marketplace
      cy.contains("Marketplace").should('be.visible')
      .next().should('contain', 'owner').contains('owner').click()
      cy.contains("Select All").click()

      cy.contains("Marketplace").should('be.visible')
      .next().should('contain', 'Roles').next().should('contain', 'Sites').contains('Sites').click()
      cy.contains("Select All").click()

      cy.get('.css-1cukyn2-MuiButtonBase-root-MuiButton-root').click()
      cy.get('[data-testid="pagination-rows"]').click()
      cy.get('[data-value="100"]').click()


      
      cy.contains("TestData TestData")
      .parents('tr')
      .contains('erv, analytics, admin, marketplace').should('not.exist')  
                

  

        cy.get('.MuiAvatar-root').should('be.visible').click()
        cy.get('.MuiList-root > .MuiButtonBase-root').should('be.visible').click({ force: true })
            cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
                cy.contains("Sign Off Successful").should('be.visible')
                cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
                });   

    });

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

    it ("can add and delete user", () => {
   
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