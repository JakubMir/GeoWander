describe('Countries', () => {
  it('Check countries', () => {
    const countryNames = ['Czechia', 'Germany', 'France', 'Spain', 'Italy'];

    cy.visit("http://localhost:3000")
    cy.get('#navMainButton').click()
    cy.get('#navPlayButton').click()

    for (let i = 0; i < 5; i++) {
      const countryName = countryNames[Math.floor(Math.random() * countryNames.length)];

      cy.get('#navCountryListButton').click()

      cy.get('#CountryListSearchCountries').type(countryName)

      cy.get('#CountryListButton').should('be.visible')
      cy.get('#CountryListButton').click()

      cy.wait(1500)
    }

  });

  it('Wrong and good login', () => {

    let username: string = "dan@gmail.com"
    let password: string = "dan123"

    cy.visit('http://localhost:3000')

    cy.get('#navLogin').click()

    cy.get('#LoginEmail').type('dan@gmail.com')
    cy.get('#LoginPassword').type('dan13')
    cy.get('#LoginButton').click()

    cy.get('#error-message').should('be.visible')

    cy.get('#LoginPassword').clear()
    cy.get('#LoginEmail').clear()

    cy.login(username,password)


  });

});
