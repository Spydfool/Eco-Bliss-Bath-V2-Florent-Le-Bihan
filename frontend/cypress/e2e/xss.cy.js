describe("Sécurité XSS dans les avis", () => {
  it("Empêche l’injection de script dans un commentaire", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.get('[data-cy="login-form"]').should("be.visible");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("eq", "http://localhost:4200/#/");
    cy.visit("http://localhost:4200/#/reviews");
    cy.get('[data-cy="review-form"]').should("be.visible");
    cy.get('[data-cy="review-input-title"]').type("Test XSS");
    cy.get('[data-cy="review-input-comment"]').type(
      '<script>alert("xss")</script>'
    );
    cy.get('[data-cy="review-submit"]').click();
    cy.contains('<script>alert("xss")</script>').should("not.exist");
  });
});
