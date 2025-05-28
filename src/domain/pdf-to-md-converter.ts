import { spawn } from "child_process";
import { singleton } from "tsyringe";

@singleton()
export default class PdfToMdConverter {
  convert(pdfSource: string, mdOutputPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      console.log("markitdown", [pdfSource, "-o", mdOutputPath]);
      console.log(`markitdown ${pdfSource} -o ${mdOutputPath}`);
      let mdResultCode = "";
      const markitdown = spawn("markitdown", [pdfSource]);
      markitdown.on("error", (err) => reject(err));
      markitdown.stdout.on("data", (data: Buffer) => {
        mdResultCode += data.toString();
      });
      markitdown.stderr.on("data", (data: Buffer) =>
        console.log(data.toString()),
      );
      markitdown.on("close", (code) => {
        if (code === 0) {
          resolve(mdResultCode);
        } else {
          reject(new Error(`proccess exited with code ${code}`));
        }
      });
    }).catch((e) => {
      console.error("markitdown error: ", e);
      throw e;
    });
  }
}
