import { spawn } from "child_process";
import { singleton } from "tsyringe";

@singleton()
export default class MDToPDFConverter {
  public convert(sourceFile: string, outFile = "out.pdf"): Promise<string> {
    return new Promise((resolve, reject) => {
      const pandoc = spawn("pdf", [sourceFile]);
      pandoc.on("error", (err) => reject(err));
      pandoc.on("close", (code) => {
        if (code === 0) resolve(outFile);
        reject(new Error(`proccess exited with code ${code}`));
      });
    });
  }
}
