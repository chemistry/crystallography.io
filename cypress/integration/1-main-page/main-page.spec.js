/// <reference types="cypress" />

describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('https://crystallography.io/')
  })

  describe('main page', () => {
    it("should display 5 tabs", () => {
      cy.get('.app-layout-header .tab-item').should('have.length', 5);
    });
  });
});
