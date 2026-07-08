const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: false,
    fixturesFolder: false,
    specPattern: "cypress/e2e/**/*.cy.js",
  },
});
