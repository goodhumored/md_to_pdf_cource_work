import dotenv from "dotenv";

dotenv.config();

export type Config = {
  db: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    connectionString: string;
  };
  fileStorage: {
    public_url: string;
    host: string;
    bucket_name: string;
    system_bucket: string;
    port: number | undefined;
    accessKey: string;
    secretKey: string;
    upload_max_size: number;
    useSSL: boolean;
  };
};

const config: Config = {
  db: {
    host: process.env["DB_HOST"] ?? "localhost",
    port: parseInt(process.env["DB_PORT"] || "3308", 10),
    name: process.env["DB_NAME"] ?? "md_to_pdf",
    username: process.env["DB_USERNAME"] ?? "user",
    password: process.env["DB_PASSWORD"] ?? "password",
    connectionString: process.env["DATABASE_URL"] ?? "",
  },
  fileStorage: {
    public_url: process.env["FS_PUBLIC_URL"] || "localhost",
    host: process.env["FS_HOST"] || "localhost",
    bucket_name: process.env["FS_BUCKET_NAME"] || "",
    port: parseInt(process.env["FS_PORT"] ?? "80", 10),
    accessKey: process.env["FS_ACCESS_KEY"] || "",
    secretKey: process.env["FS_SECRET_KEY"] || "",
    system_bucket: process.env["FS_SYSTEM_BUCKET"] ?? "system",
    upload_max_size: process.env["FS_UPLOAD_MAX_SIZE"]
      ? parseInt(process.env["FS_UPLOAD_MAX_SIZE"], 10)
      : 1024 * 1024 * 3,
    useSSL: process.env["FS_USE_SSL"] === "true",
  },
};
export default config;
