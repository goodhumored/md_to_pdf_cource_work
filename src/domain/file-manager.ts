import { writeFile } from "fs/promises";
import { singleton } from "tsyringe";

@singleton()
export default class FileManager {
  async uploadFile(name: string, file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const url = `public/${name}`;
    await writeFile(url, Buffer.from(bytes));
    return url;
  }
}
