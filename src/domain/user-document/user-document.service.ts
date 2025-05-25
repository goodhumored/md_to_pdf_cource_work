import { singleton } from "tsyringe";
import LatexTemplateRepository from "../../infrastructure/latex-template/latex-template.repository";
import TitlePageRepository from "../../infrastructure/title-page/title-page.repository";
import UserDocumentRepository from "../../infrastructure/user-document/user-document.repository";
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
    newDocument.writeMd("# Пример");
    return this._repo.save(newDocument);
  }

  async getUserDocuments() {
    const user = await this._userService.getCurrentUserOrRedirectToAuth();
    return this._repo.getByOwnerId(user.getId()!);
  }

  async updateUserDocMarkdown(documentId: string, newMarkdown: string) {
    const doc = await this._repo.getById(documentId);
    if (!doc) throw new Error("Document not found");
    await doc.writeMd(newMarkdown);
    await this._converter.convertUserDoc(doc);
    if (!doc.getTitlePage()) {
      const newCover = await this._coverExtractor.getPDFCover(
        doc.getLocalPdfFilePath(),
      );
      doc.setCoverUrl(newCover);
    }
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
    await this._converter.convertUserDoc(doc);
    if (!doc.getTitlePage()) {
      const newCover = await this._coverExtractor.getPDFCover(
        doc.getLocalPdfFilePath(),
      );
      doc.setCoverUrl(newCover);
    }
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
    await this._converter.convertUserDoc(doc);
    const newCover = await this._coverExtractor.getPDFCover(
      doc.getLocalPdfFilePath(),
    );
    doc.setCoverUrl(newCover);
    return this._repo.save(doc);
  }
}
