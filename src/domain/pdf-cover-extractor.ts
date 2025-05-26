import { spawn } from "child_process";
import { readdirSync } from "fs";
import { dirname } from "path";
import { singleton } from "tsyringe";

@singleton()
export default class PdfCoverExtractor {
  getPDFCover(pdf: string, _outputPath?: string) {
    const outputname = _outputPath ?? pdf + ".cover.webp";
    return new Promise<string>((resolve, reject) => {
      const dir = dirname(pdf);
      console.log(dir, readdirSync(dir));
      console.log(`magick '${pdf}[0]' '${outputname}'`);
      console.log("magick", [`'${pdf}[0]'`, `'${outputname}'`]);
      const pandoc = spawn("magick", [pdf + "[0]", outputname]);
      pandoc.on("error", (err) => reject(err));
      pandoc.stdout.on("data", (data: Buffer) => console.log(data.toString()));
      pandoc.stderr.on("data", (data: Buffer) =>
        console.error(data.toString()),
      );
      pandoc.on("close", (code) => {
        if (code === 0) resolve(outputname);
        console.error(`oshibka ebanaya ${code}`);
        reject(new Error(`proccess exited with code ${code}`));
      });
    });
  }
}
