/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
const { migrate } = require("node-pg-migrate");
const config = require("./migrate");

async function runMigrations() {
  try {
    await migrate(config);
    console.log("Migrations applied successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
