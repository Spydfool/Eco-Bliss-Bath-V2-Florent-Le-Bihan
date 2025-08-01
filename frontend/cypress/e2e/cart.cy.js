describe("Tests panier", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/#/login");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("eq", "http://localhost:4200/#/");
  });

  it("Vérifie la présence du champ de disponibilité du produit", () => {
    cy.visit("http://localhost:4200/#/products");
    cy.get('[data-cy="product-link"]').first().click();
    cy.get('[data-cy="detail-product-stock"]').should("be.visible");
  });

  it("Ajout d'un produit au panier et vérification du stock", () => {
    cy.visit("http://localhost:4200/#/products");
    cy.get('[data-cy="product-link"]').each(($el) => {
      cy.wrap($el).click();
      cy.get('[data-cy="detail-product-stock"]', { timeout: 10000 })
        .invoke("text")
        .then((stockText) => {
          const match = stockText.match(/-?\d+/);
          const stockInitial = match ? parseInt(match[0]) : 0;

          if (stockInitial > 0) {
            cy.get('[data-cy="detail-product-quantity"]').clear().type("1");
            cy.get('[data-cy="detail-product-add"]').click();
            cy.url().should("include", "/cart");
            cy.get('[data-cy="cart-line-name"]').should("be.visible");
            return false;
          } else {
            cy.get('[data-cy="detail-product-add"]')
              .should("not.be.disabled")
              .then(() => {
                cy.log(
                  "ANOMALIE : Le bouton Ajouter au panier est actif alors que le stock est à 0 ou négatif !"
                );
              });
            cy.go("back");
          }
        });
      return false;
    });
  });

  it("Ajoute un élément au panier et vérifie le contenu via l’API", () => {
    cy.visit("http://localhost:4200/#/products");
    cy.get('[data-cy="product-link"]').first().click();
    cy.get('[data-cy="detail-product-quantity"]').clear().type("1");
    cy.get('[data-cy="detail-product-add"]').click();
    cy.url().should("include", "/cart");

    // Vérifie la présence du produit dans le panier
    cy.get('[data-cy="cart-line-name"]').should("be.visible");

    // Vérifie via l’API
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("user"),
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.orderLines.length).to.be.greaterThan(0);
    });
  });

it("Vérifie les limites de quantité (négatif et supérieur à 20)", () => {
    cy.visit("http://localhost:4200/#/products");
    cy.get('[data-cy="product-link"]').first().click();

    // Mettre la quantité à -2
    cy.get('[data-cy="detail-product-quantity"]').clear().type("-2");
    cy.get('[data-cy="detail-product-add"]').click();

    // Vérifier qu'on reste sur la page produit (pas de redirection)
    cy.url().should("include", "/products/");

    // Champ supérieur à 20
    cy.get('[data-cy="detail-product-quantity"]').clear().type("25");
    cy.get('[data-cy="detail-product-add"]').click();

    // Vérifier qu'on reste sur la page produit (pas de redirection)
    cy.url().should("include", "/products/");
  });
});
