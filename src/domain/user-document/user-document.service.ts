import { join } from "path";
import { singleton } from "tsyringe";
import LatexTemplateRepository from "../../infrastructure/latex-template/latex-template.repository";
import MinioService from "../../infrastructure/minio.service";
import TitlePageRepository from "../../infrastructure/title-page/title-page.repository";
import UserDocumentRepository from "../../infrastructure/user-document/user-document.repository";
import writeFileWithDir from "../../utils/write-file-with-dir";
import MDToPDFConverter from "../md-to-pdf-converter";
import PdfCoverExtractor from "../pdf-cover-extractor";
import UserService from "../user/user.service";
import UserDocument from "./user-document";

@singleton()
export default class UserDocumentService {
  constructor(
    private readonly _repo: UserDocumentRepository,
    private readonly _userService: UserService,
    private readonly _titleService: TitlePageRepository,
    private readonly _converter: MDToPDFConverter,
    private readonly _minio: MinioService,
    private readonly _coverExtractor: PdfCoverExtractor,
    private readonly _templateRepo: LatexTemplateRepository,
    private readonly _titleRepo: TitlePageRepository,
  ) {}

  async createDocument(name: string, title?: string): Promise<UserDocument> {
    const user = await this._userService.getCurrentUserOrRedirectToAuth();
    const newDocument = UserDocument.create(user, name);
    if (!!title) {
      console.log(title, !!title, typeof title);
      const titlePage = await this._titleService.getById(title);
      newDocument.setTitlePage(titlePage);
    }
    await this.convertUserDoc(newDocument, true, "# Пример");
    return this._repo.save(newDocument);
  }

  async getUserDocuments() {
    const user = await this._userService.getCurrentUserOrRedirectToAuth();
    return this._repo.getByOwnerId(user.getId()!);
  }

  async getUserDocument(id: string): Promise<UserDocument<string>> {
    return this._repo.getById(id).then(async (d) => {
      if (!d) throw new Error("Not Found");
      return d.setMdCode(await this._minio.readFile(d.getMdPath()));
    });
  }

  async updateUserDocMarkdown(documentId: string, newMarkdown: string) {
    const doc = await this._repo.getById(documentId);
    if (!doc) throw new Error("Document not found");
    await this.convertUserDoc(doc, !doc.getTitlePage(), newMarkdown);
    return await this._repo.save(doc);
  }

  async updateDocTemplate(
    documentId: string,
    newTemplateId: string | undefined,
  ) {
    const doc = await this._repo.getById(documentId);
    if (!doc) throw new Error("Document not found");
    if (newTemplateId) {
      const template = await this._templateRepo.getById(newTemplateId);
      if (!template) throw new Error("Template not found");
      doc.setLatexTemplate(template);
    } else doc.setLatexTemplate(undefined);
    await this.convertUserDoc(doc, !doc.getTitlePage());
    return await this._repo.save(doc);
  }

  async updateDocTitle(documentId: string, newTitleId: string | undefined) {
    const doc = await this._repo.getById(documentId);
    if (!doc) throw new Error("Document not found");
    if (newTitleId) {
      const title = await this._titleRepo.getById(newTitleId);
      if (!title) throw new Error("Title not found");
      doc.setTitlePage(title);
    } else doc.setTitlePage(undefined);
    await this.convertUserDoc(doc, true);
    return this._repo.save(doc);
  }

  public convertUserDoc(
    doc: UserDocument,
    updateCover = false,
    newMd?: string,
  ) {
    return this._minio.withFiles(
      [
        doc.getMdPath(),
        doc.getThumbnailPath(),
        doc.getTitlePage()?.getFilename(),
        doc.getLatexTemplate()?.getFilename(),
      ],
      async (cwd, [_md, _tn, _title, _template]) => {
        const md = (await _md) ?? join(cwd, doc.getMdPath());
        if (newMd) {
          await writeFileWithDir(md, Buffer.from(newMd));
        }
        const pdf = join(cwd, doc.getPdfPath());
        const thumbnail = join(cwd, doc.getThumbnailPath());
        await this._converter.convert(md, pdf, await _title, await _template);
        if (updateCover) await this._coverExtractor.getPDFCover(pdf, thumbnail);
        return [(await _tn)!, pdf]
          .concat(updateCover ? [thumbnail] : [])
          .concat(newMd ? [md] : []);
      },
    );
  }
}
