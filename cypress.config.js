const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'r7pxh7',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://pushing-it.vercel.app",
    watchForFileChanges: false,
    defaultCommandTimeout: 10000,
  },
});
