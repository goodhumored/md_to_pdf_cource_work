import { spawn } from "child_process";
import { writeFile } from "fs";

export default class MDToPDFConverter {
  public static convert(md: string, outFile = "out.pdf"): Promise<string> {
    const tmpFileName = outFile.replace(".pdf", ".md");
    return new Promise((resolve, reject) => {
      writeFile(tmpFileName, md, (err) => {
        if (err) reject(err);
        const pandoc = spawn("pdf", [tmpFileName]);
        pandoc.on("error", (err) => reject(err));
        pandoc.on("close", (code) => {
          if (code === 0) resolve(outFile);
          reject(new Error(`proccess exited with code ${code}`));
        });
      });
    });
  }
}
