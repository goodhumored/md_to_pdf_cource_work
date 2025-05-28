import { rm } from "fs/promises";
import { join } from "path";
import { singleton } from "tsyringe";
import LatexTemplateRepository from "../../infrastructure/latex-template/latex-template.repository";
import MinioService from "../../infrastructure/minio.service";
import TitlePageRepository from "../../infrastructure/title-page/title-page.repository";
import UserDocumentRepository from "../../infrastructure/user-document/user-document.repository";
import writeFileWithDir from "../../utils/write-file-with-dir";
import MDToPDFConverter from "../md-to-pdf-converter";
import PdfCoverExtractor from "../pdf-cover-extractor";
import PdfToMdConverter from "../pdf-to-md-converter";
import UserService from "../user/user.service";
import UserDocument from "./user-document";

@singleton()
export default class UserDocumentService {
  constructor(
    private readonly _repo: UserDocumentRepository,
    private readonly _userService: UserService,
    private readonly _titleService: TitlePageRepository,
    private readonly _md2pdfConverter: MDToPDFConverter,
    private readonly _pdf2mdConverter: PdfToMdConverter,
    private readonly _minio: MinioService,
    private readonly _coverExtractor: PdfCoverExtractor,
    private readonly _templateRepo: LatexTemplateRepository,
    private readonly _titleRepo: TitlePageRepository,
  ) {}

  async createDocument(
    name: string,
    title?: string,
    templateId?: string,
    existingDocument?: File,
  ): Promise<UserDocument> {
    const user = await this._userService.getCurrentUserOrRedirectToAuth();
    const newDocument = UserDocument.create(user, name);
    if (title) {
      const titlePage = await this._titleService.getById(title);
      newDocument.setTitlePage(titlePage);
    }
    if (templateId) {
      const template = await this._titleService.getById(templateId);
      newDocument.setTitlePage(template);
    }
    let initialMd = "# Пример";
    if (existingDocument) {
      const pdfPath = this._minio.getTempPath(
        join(newDocument.getId(), "prototype.pdf"),
      );
      const buffer = Buffer.from(await existingDocument.arrayBuffer());
      await writeFileWithDir(pdfPath, buffer);
      initialMd = await this._pdf2mdConverter.convert(
        pdfPath,
        this._minio.getTempPath(newDocument.getMdPath()),
      );
      await rm(pdfPath);
    }
    await this.convertUserDoc(newDocument, true, initialMd);
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
    return this.updateUserDoc(documentId, undefined, newTemplateId);
  }

  async updateDocTitle(documentId: string, newTitleId: string | undefined) {
    return this.updateUserDoc(documentId, undefined, undefined, newTitleId);
  }

  async updateUserDoc(
    documentId: string,
    newName?: string,
    newTemplateId?: string,
    newTitleId?: string,
  ) {
    const doc = await this._repo.getById(documentId);
    if (!doc) throw new Error("Document not found");
    if (newName) doc.setName(newName);
    if (newTemplateId) {
      const template = await this._templateRepo.getById(newTemplateId);
      if (!template) throw new Error("Template not found");
      doc.setLatexTemplate(template);
    } else if (newTemplateId === null) doc.setLatexTemplate(undefined);
    if (newTitleId) {
      const title = await this._titleRepo.getById(newTitleId);
      if (!title) throw new Error("Title not found");
      doc.setTitlePage(title);
    } else if (newTitleId === null) doc.setTitlePage(undefined);
    if (newTitleId !== undefined || newTemplateId !== undefined)
      await this.convertUserDoc(doc, !doc.getTitlePage());
    return await this._repo.save(doc);
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
        await this._md2pdfConverter.convert(
          md,
          pdf,
          await _title,
          await _template,
        );
        if (updateCover) await this._coverExtractor.getPDFCover(pdf, thumbnail);
        return [(await _tn)!, pdf]
          .concat(updateCover ? [thumbnail] : [])
          .concat(newMd ? [md] : []);
      },
    );
  }

  public async deleteDocument(userId: number, documentId: string) {
    const doc = await this._repo.getById(documentId);
    if (doc?.getOwner().getId() != userId)
      throw new Error("Пользователь не является владельцем документа");
    await this._repo.deleteById(documentId);
  }
}
