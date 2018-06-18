// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {

    cy.server();
    cy.route("GET", /recorridos/).as("getRecorridos");

    cy.visit('/la-plata/')
    cy.viewport(360, 640)

    cy.get('.mapContainer').click(5, 186)
    cy.get('.mapContainer').click(70, 206)
    cy.wait('@getRecorridos').then(function(xhr){
      // we can now access the low level xhr
      // that contains the request body,
      // response body, status, etc
      console.log(xhr.status, xhr.body)
    })

  })
})
