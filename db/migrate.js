/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require("pg");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

module.exports = {
  client: async () => {
    const parentEnvPath = path.resolve(__dirname, "../.env");
    const localEnvPath = path.resolve(__dirname, ".env");

    if (fs.existsSync(parentEnvPath)) {
      dotenv.config({ path: parentEnvPath });
    } else if (fs.existsSync(localEnvPath)) {
      dotenv.config({ path: localEnvPath });
    } else {
      console.warn("No .env file found in parent or current directory");
    }
    console.log("using", process.env.DATABASE_URL);
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
