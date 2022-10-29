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
        cy.get('.MuiList-root > .MuiButtonBase-root').click({ force: true })
            cy.origin("https://ssotest.walgreens.com/idp/idpLogout", () => {
                cy.contains("Sign Off Successful").should('be.visible')
                cy.url().should('contains', "https://ssotest.walgreens.com/idp/idpLogout")
                });   

    });
})