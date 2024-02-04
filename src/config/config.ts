import dotenv from "dotenv";

dotenv.config();

export type Config = {
  db: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
  };
};

const config: Config = {
  db: {
    host: process.env["DB_HOST"] ?? "localhost",
    port: parseInt(process.env["DB_PORT"] || "3308", 10),
    name: process.env["DB_NAME"] ?? "md_to_pdf",
    username: process.env["DB_USERNAME"] ?? "user",
    password: process.env["DB_PASSWORD"] ?? "password"
  }
};
export default config;
