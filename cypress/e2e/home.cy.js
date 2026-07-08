describe("Home page", () => {
  it("loads with the shared header, footer and main content", () => {
    cy.visit("/");

    cy.title().should("eq", "PAP");
    cy.get("header").should("exist");
    cy.get("footer").should("exist");
    cy.get("main").should("exist");

    // A stable section rendered from the (mock) product list.
    cy.contains("Nos produits").should("be.visible");
  });
});
