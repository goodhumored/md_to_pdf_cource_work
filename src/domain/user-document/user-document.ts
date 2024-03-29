import { open } from "fs/promises";
import { v4 } from "uuid";
import LatexTemplate from "../latex-template/latex-template";
import TitlePage from "../title-page/title-page";
import User from "../user/user";

export default class UserDocument {
  private _id: string;

  private _owner: User;

  private _name: string;

  private _mdPath: string;

  private _pdfPath: string;

  private _titlePage?: TitlePage | undefined;

  private _template?: LatexTemplate | undefined;

  private _createdAt: Date;

  private _updatedAt: Date;

  private _isNew: boolean;

  constructor(
    data: {
      id: string;
      owner: User;
      name: string;
      mdPath: string;
      pdfPath: string;
      createdAt: Date;
      updatedAt: Date;
      titlePage?: TitlePage | undefined;
      template?: LatexTemplate | undefined;
    },
    isNew?: boolean
  ) {
    this._id = data.id;
    this._owner = data.owner;
    this._name = data.name;
    this._mdPath = data.mdPath;
    this._pdfPath = data.pdfPath;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._isNew = !!isNew;
    this._titlePage = data.titlePage;
    this._template = data.template;
  }

  static create(owner: User, name: string, mdPath?: string, pdfPath?: string) {
    const id = v4();
    return new UserDocument(
      {
        id,
        owner,
        name,
        mdPath: mdPath ?? `${name}-${id}.md`,
        pdfPath: pdfPath ?? `${name}-${id}.pdf`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      true
    );
  }

  getId(): string {
    return this._id;
  }

  getOwner(): User {
    return this._owner;
  }

  getName(): string {
    return this._name;
  }

  getMdCode(): Promise<string> {
    return open(this.getLocalMdFilePath(), "r")
      .then((f) => f.readFile().then((b) => f.close().then(() => b.toString())))
      .catch(() => "");
  }

  writeMd(md: string): Promise<void> {
    return open(this.getLocalMdFilePath(), "w+")
      .then((f) => f.writeFile(md).then(() => f.close()))
      .then(() => {
        this._updatedAt = new Date();
      });
  }

  getLocalPdfFilePath(): string {
    return `public/${this._pdfPath}`;
  }

  getLocalMdFilePath(): string {
    return `public/${this._mdPath}`;
  }

  getPublicMd(): string {
    return `/${this._mdPath}`;
  }

  getMdPath(): string {
    return `${this._mdPath}`;
  }

  getPdfPath(): string {
    return `${this._pdfPath}`;
  }

  getPublicPdfPath(): string {
    return `/${this._pdfPath}`;
  }

  getLatexTemplate(): LatexTemplate | undefined {
    return this._template;
  }

  setLatexTemplate(template: LatexTemplate | undefined) {
    this._template = template;
  }

  getTitlePage(): TitlePage | undefined {
    return this._titlePage;
  }

  setTitlePage(title: TitlePage | undefined) {
    this._titlePage = title;
  }

  getUpdatedAt(): Date {
    return this._updatedAt;
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }

  isNew(): boolean {
    return this._isNew;
  }
}
