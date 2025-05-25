import { spawn } from "child_process";
import { singleton } from "tsyringe";

@singleton()
export default class PdfCoverExtractor {
  getPDFCover(pdf: string, _outputPath?: string) {
    const outputname = _outputPath ?? pdf + ".cover.webp";
    return new Promise<string>((resolve, reject) => {
      const pandoc = spawn("magick", [pdf + "[0]", outputname]);
      pandoc.on("error", (err) => reject(err));
      pandoc.stdout.on("data", (data: Buffer) => console.log(data.toString()));
      pandoc.on("close", (code) => {
        if (code === 0) resolve(outputname);
        reject(new Error(`proccess exited with code ${code}`));
      });
    });
  }
}
