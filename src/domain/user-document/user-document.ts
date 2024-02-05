import { open } from "fs/promises";
import { v4 } from "uuid";
import User from "../user/user";

export default class UserDocument {
  private _id: string;

  private _owner: User;

  private _name: string;

  private _mdPath: string;

  private _pdfPath: string;

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
  }

  static create(owner: User, name: string, mdPath?: string, pdfPath?: string) {
    const id = v4();
    return new UserDocument(
      {
        id,
        owner,
        name,
        mdPath: mdPath ?? `public/${name}-${id}.md`,
        pdfPath: pdfPath ?? `public/${name}-${id}.pdf`,
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
    return open(this._mdPath, "r")
      .then((f) => f.readFile())
      .then((b) => b.toString())
      .catch(() => "");
  }

  writeMd(md: string): Promise<void> {
    return open(this._mdPath, "r")
      .then((f) => f.writeFile(md))
      .then(() => {
        this._updatedAt = new Date();
      });
  }

  getPdfFilePath(): string {
    return this._pdfPath;
  }

  getMdFilePath(): string {
    return this._mdPath;
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
