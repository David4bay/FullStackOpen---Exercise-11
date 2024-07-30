const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 60000,
    pageLoadTimeout: 60000,
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
