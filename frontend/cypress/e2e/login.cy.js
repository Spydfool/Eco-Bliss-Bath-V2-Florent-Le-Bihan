describe("Connexion utilisateur", () => {
  it("Connecte un utilisateur avec de bons identifiants", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.get('[data-cy="login-form"]').should("be.visible");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("eq", "http://localhost:4200/#/");
    cy.get('[data-cy="nav-link-cart"]').should("be.visible");
  });

  it("Affiche une erreur avec de mauvais identifiants", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.get('[data-cy="login-input-username"]').type("fake@email.com");
    cy.get('[data-cy="login-input-password"]').type("wrongpass");
    cy.get('[data-cy="login-submit"]').click();

    cy.get('[data-cy="login-errors"]').should(
      "contain",
      "Identifiants incorrects"
    );
  });
});
