import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

export default async function writeFileWithDir(path: string, buffer: Buffer) {
  console.log("creating file with dir", path);
  const dir = dirname(path);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path, buffer);
    console.log(`File written successfully to ${path}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}
