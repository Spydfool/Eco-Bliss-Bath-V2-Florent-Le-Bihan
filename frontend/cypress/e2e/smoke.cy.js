describe("Smoke tests", () => {
  it("Page d’accueil accessible et affiche les éléments principaux", () => {
    cy.visit("http://localhost:4200/#/");
    cy.contains("Il y en a pour tous les gouts").should("be.visible");
    cy.contains("Voir les produits").should("be.visible");
    cy.contains("Notre sélection pour toi").should("be.visible");
    cy.get('[data-cy="product-home"]').should("exist");
    cy.get('[data-cy="product-home-name"]').first().should("be.visible");
    cy.get('[data-cy="product-home-link"]').first().should("be.visible");
  });

  it("Page produits accessible et affiche la liste des produits", () => {
    cy.visit("http://localhost:4200/#/products");
    cy.contains("Nos produits").should("be.visible");
    cy.get('[data-cy="product"]').should("exist");
    cy.get('[data-cy="product-name"]').first().should("be.visible");
    cy.get('[data-cy="product-link"]').first().should("be.visible");
  });

  it("Page avis accessible", () => {
    cy.visit("http://localhost:4200/#/reviews");
    cy.contains("Votre avis").should("be.visible");
    cy.get('[data-cy="reviews-average"]').should("exist");
  });

  it("Page connexion accessible", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.get('[data-cy="login-form"]').should("be.visible");
  });

  it("Affiche les champs et boutons de connexion", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.get('[data-cy="login-form"]').should("be.visible");
    cy.get('[data-cy="login-input-username"]').should("exist");
    cy.get('[data-cy="login-input-password"]').should("exist");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  it("Affiche le bouton d’ajout au panier sur la page produit quand connecté", () => {
    cy.visit("http://localhost:4200/#/login");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("eq", "http://localhost:4200/#/");
    cy.visit("http://localhost:4200/#/products");
    cy.get('[data-cy="product-link"]').first().click();
    cy.get('[data-cy="detail-product-add"]').should("be.visible");
  });
});
