/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require("pg");

module.exports = {
  client: async () => {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    return client;
  },
  migration: {
    directory: "./migrations",
    table: "pgmigrations",
  },
};
