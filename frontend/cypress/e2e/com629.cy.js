describe("Search + Category Filter", () => {
  it("loads the page", () => {
    cy.visit("https://com629-y3-ae2.onrender.com", {
  timeout: 60000,
});

    cy.contains("Product Search").should("exist");
  });

  it("searches products", () => {
    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.get('input[placeholder="Search..."]').type("iphone");
    cy.contains("Search").click();

    cy.get("h3").should("exist");
  });

  it("toggles category filter", () => {
    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.contains("Phones").click();

    cy.get("h3").should("exist");
  });
});

describe("Price filter test", () => {
  it("filters products using min and max price", () => {
    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.contains("Product Search System", { timeout: 10000 });

    cy.intercept("GET", "**/search/products*").as("searching");

    cy.get('input[placeholder="Min"]').type("100");

    cy.get('input[placeholder="Max"]').type("500");


    cy.contains("Apply").click();

    cy.wait("@searching");

    cy.get("p")
     .contains("£")
     .each(($el) => {
       const text = $el.text();
       const price = Number(text.replace("£", ""));
       expect(price).to.be.gte(100);
       expect(price).to.be.lte(500);
     });
  });
});

