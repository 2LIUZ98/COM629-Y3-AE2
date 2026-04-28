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


  it("resets search", () => {
    cy.visit("https://com629-y3-ae2.onrender.com");
    cy.contains("Search")
          .parent()
          .within(() => {
            cy.contains("Reset").click();
          });

        cy.contains("Apply").click();

        cy.get("h3").should("exist");
      });

  it("toggles category filter", () => {
    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.contains("Phones").click();

    cy.get("h3").should("exist");
  });
});

describe("Price filter test", () => {
  it("filters products using price filter", () => {
    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.contains("Product Search System", { timeout: 10000 });

    cy.intercept("GET", "**/search/products*").as("searchingFilterPrice");

    cy.get('input[placeholder="Min"]').type("100");

    cy.get('input[placeholder="Max"]').type("500");


    cy.contains("Apply").click();

    cy.wait("@searchingFilterPrice");

    cy.get("p")
     .contains("£")
     .each(($el) => {
       const text = $el.text();
       const price = Number(text.replace("£", ""));
       expect(price).to.be.gte(100);
       expect(price).to.be.lte(500);
     });
  });

  it("resets price filter", () => {
    cy.intercept("GET", "**/search/products*").as("searchingRestPrice");

    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.contains("Price")
      .parent()
      .within(() => {
        cy.contains("Reset").click();
      });

    cy.contains("Apply").click();

    cy.wait("@searchingRestPrice");

    cy.get("h3").should("exist");
  });
});

describe("Tags filter + reset", () => {
  it("filter products using tags filter", () => {
    cy.intercept("GET", "**/search/products*").as("searchingFilterTags");

    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.get('input[type="checkbox"]').eq(4).check({ force: true });

    cy.contains("Apply").click();

    cy.wait("@searchingFilterTags");

    cy.get("h3").each(($el) => {
      expect($el.text()).to.exist;
    });
  });

  it("resets tags filter", () => {
    cy.intercept("GET", "**/search/products*").as("searchingResetTags");

    cy.visit("https://com629-y3-ae2.onrender.com");

    cy.contains("Tags")
      .parent()
      .within(() => {
        cy.contains("Reset").click();
      });

    cy.contains("Apply").click();

    cy.wait("@searchingResetTags");

    cy.get("h3").should("exist");
  });
});

