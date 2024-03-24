const { defineConfig } = require("cypress");
//const sqlServer = require('cypress-sql-server');
const { Client } = require("pg");

module.exports = defineConfig({
  projectId: 'r7pxh7',
  e2e: {
    setupNodeEvents(on, config) {
      //task = sqlServer.loadDBPlugin(config.db);
      //on('task', task);
      on("task", {
        async connectDB(query){
          const client = new Client({
            /*user: "avanzado1",
            password: "Eeb8mCmBhGZLhr42CR7d3eE6w2JdCDeW",
            host: "dpg-co03e38l6cac73cnegf0-a.oregon-postgres.render.com",
            database: "avanzado1_0qkr",*/
            
            //Pushing IT
            user: "pushingit",
            password: "E6gcqTtuRGliO02Wg3Gs8fqyQNK1fLjE",
            host: "dpg-cngrs0da73kc73c91170-a.oregon-postgres.render.com",
            database: "pushingit_j4z6",
            ssl: true,
            port: 5432
          })
          await client.connect()
          const res = await client.query(query)
          await client.end()
          return res.rows;
        }
      })
    },
    baseUrl: "https://pushing-it.vercel.app",
    watchForFileChanges: false,
    defaultCommandTimeout: 10000,
    fixturesFolder: "cypress/e2e"
  },
  env: {
    usuario: "pushingit",
    password: "123456!",
    baseUrlAPI: 'https://pushing-it.onrender.com/api',
    token: ''
  },
  //SQL SERVER
  // "db": {
  //   "userName": "avanzado1",
  //   "password": "K2VE0V1Zbm2U0556VZ2fWKyAMgtMutTI",
  //   "server": "dpg-cnl4j7acn0vc73fifpig-a.oregon-postgres.render.com",
  //   "options": {
  //     "database": "avanzado1",
  //     "encrypt": true,
  //     "rowCollectionOnRequestCompletion": true
  //   }
  // }
});
