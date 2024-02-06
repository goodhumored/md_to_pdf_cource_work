import { spawn } from "child_process";
import { rename, unlink } from "fs/promises";
import { singleton } from "tsyringe";
import UserDocument from "./user-document/user-document";

@singleton()
export default class MDToPDFConverter {
  public convertUserDoc(userDocument: UserDocument) {
    return this.convert(
      userDocument.getLocalMdFilePath(),
      userDocument.getLocalPdfFilePath(),
      userDocument.getTitlePage()?.getFilename(),
      userDocument.getLatexTemplate()?.getFilename()
    );
  }

  async convert(sourceFile: string, outPath: string, titlePath = "", templatePath = ""): Promise<void> {
    await this.pandoc(sourceFile, templatePath);
    if (titlePath) await this.addTitle(`${outPath}`, `public/${titlePath}`);
  }

  private pandoc(sourceMd: string, templatePath?: string) {
    const args = [sourceMd];
    if (templatePath) args.push("--template", `public/${templatePath}`);
    return new Promise<void>((resolve, reject) => {
      console.log("pdf", args.join(" "));
      const pandoc = spawn("pdf", args);
      pandoc.on("error", (err) => reject(err));
      pandoc.stdout.on("data", (data: Buffer) => console.log(data.toString()));
      pandoc.on("close", (code) => {
        if (code === 0) resolve();
        reject(new Error(`proccess exited with code ${code}`));
      });
    });
  }

  private addTitle(pdfPath: string, titlePath: string) {
    const outPath = `${pdfPath}-1`;
    return new Promise<void>((resolve, reject) => {
      const proccess = spawn("pdfunite", [titlePath, pdfPath, outPath]);
      proccess.on("error", (err) => reject(err));
      proccess.stdout.on("data", (data: Buffer) => console.log(data.toString()));
      proccess.on("close", (code) => {
        if (code === 0) resolve();
        reject(new Error(`proccess exited with code ${code}`));
      });
    }).then(() => rename(outPath, pdfPath));
  }
}
