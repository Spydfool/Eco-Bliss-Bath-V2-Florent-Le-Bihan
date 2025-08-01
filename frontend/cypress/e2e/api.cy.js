describe("API endpoints principaux", () => {
  const baseUrl = "http://localhost:8081";

  it("GET /api/health", () => {
    cy.request(`${baseUrl}/api/health`).its("status").should("eq", 200);
  });

  it("POST /login", () => {
    cy.request("POST", `${baseUrl}/login`, {
      username: "test2@test.fr",
      password: "testtest",
    })
      .its("status")
      .should("eq", 200);
  });

  it("GET /products", () => {
    cy.request(`${baseUrl}/products`).its("status").should("eq", 200);
  });

  it("GET /products/random", () => {
    cy.request(`${baseUrl}/products/random`).its("status").should("eq", 200);
  });

  it("GET /products/3", () => {
    cy.request(`${baseUrl}/products/3`).its("status").should("eq", 200);
  });

  it("POST /reviews", () => {
    cy.request("POST", `${baseUrl}/login`, {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      const token = response.body.token;

      cy.request({
        method: "POST",
        url: `${baseUrl}/reviews`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: "Super produit",
          comment: "Je recommande !",
          rating: 5,
        },
      })
        .its("status")
        .should("be.oneOf", [200, 201]);
    });
  });

  it("POST /register", () => {
    const uniqueEmail = `nouvelutilisateur_${Date.now()}@email.com`;
    cy.request({
      method: "POST",
      url: `${baseUrl}/register`,
      body: {
        email: uniqueEmail,
        firstname: "Prénom",
        lastname: "Nom",
        plainPassword: {
          first: "motdepasse",
          second: "motdepasse",
        },
      },
      failOnStatusCode: false,
    })
      .its("status")
      .should("be.oneOf", [200, 201]);
  });

  it("GET /me", () => {
    cy.request("POST", `${baseUrl}/login`, {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      const token = response.body.token;

      cy.request({
        method: "GET",
        url: `${baseUrl}/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      })
        .its("status")
        .should("eq", 200);
    });
  });
});
