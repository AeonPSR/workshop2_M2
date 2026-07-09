describe("Catalogue", () => {
  // Widen so the desktop sidebar (with the search box) is visible; below the
  // lg breakpoint it is hidden behind the mobile "Filtres" sheet.
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it("loads the catalogue page with its header and product count", () => {
    cy.visit("/catalogue");

    cy.contains("h1", "Tous nos produits").should("be.visible");
    // Count line, e.g. "123 produits".
    cy.contains(/\d+\s+produit/).should("exist");
    cy.get('input[placeholder="Rechercher..."]').should("be.visible");
  });

  it("shows the empty state when the search matches nothing", () => {
    cy.visit("/catalogue");

    // Wait for the product list to finish loading (spinner gone).
    cy.get(".animate-spin", { timeout: 20000 }).should("not.exist");

    cy.get('input[placeholder="Rechercher..."]').type(
      "zzz-produit-inexistant-123",
    );
    cy.contains("Aucun produit trouvé").should("be.visible");
  });

  it("pre-filters from a ?category= deep link", () => {
    cy.visit("/catalogue?category=Vins");

    // The active-filter chip is rendered purely from the URL param.
    cy.contains("button", "Vins").should("be.visible");
  });

  it("removes a category filter when its chip is clicked", () => {
    cy.visit("/catalogue?category=Vins");

    cy.contains("button", "Vins").should("be.visible").click();
    cy.contains("button", "Vins").should("not.exist");
  });
});
