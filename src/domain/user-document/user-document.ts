import { v4 } from "uuid";
import LatexTemplate from "../latex-template/latex-template";
import TitlePage from "../title-page/title-page";
import User from "../user/user";

export default class UserDocument<T extends string | undefined = undefined> {
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

  private _cover: string;

  private _mdCode!: T;

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
      thumbnail: string;
    },
    isNew?: boolean,
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
    this._cover = data.thumbnail;
  }

  static create(owner: User, name: string, mdPath?: string, pdfPath?: string) {
    const id = v4();
    return new UserDocument(
      {
        id,
        owner,
        name,
        mdPath: mdPath ?? `${id}/source.md`,
        pdfPath: pdfPath ?? `${id}/result.pdf`,
        thumbnail: `${id}/cover.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      true,
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

  getThumbnailPath(): string {
    return this._cover;
  }

  getMdPath(): string {
    return this._mdPath;
  }

  getPdfPath(): string {
    return this._pdfPath;
  }

  getMdCode(): T {
    return this._mdCode;
  }

  setMdCode<NewT extends string | undefined>(newMd: NewT): UserDocument<NewT> {
    const newThis = this as unknown as UserDocument<NewT>;
    newThis._mdCode = newMd;
    return newThis;
  }
}
