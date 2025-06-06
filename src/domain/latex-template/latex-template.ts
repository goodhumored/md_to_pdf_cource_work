import { v4 } from "uuid";

export default class LatexTemplate {
  private _id: string;

  private _name: string;

  private _filename: string;

  private _isNew: boolean;

  private _thumbnail: string;

  private _isPublic: boolean;

  private _owner: number;

  constructor(
    data: {
      id: string;
      name: string;
      filename: string;
      owner: number;
      thumbnail?: string;
      isPublic: boolean;
    },
    isNew = false,
  ) {
    this._id = data.id;
    this._name = data.name;
    this._filename = data.filename ?? `${data.owner}/${data.id}.latex`;
    this._thumbnail = data.thumbnail ?? `${data.owner}/${data.id}.webp`;
    this._isNew = isNew;
    this._isPublic = data.isPublic;
    this._owner = data.owner;
  }

  static create(owner: number, name?: string) {
    const id = v4();
    const titlePageName = name ?? id;
    const filename = `template-${name?.replace(".latex", "") ?? ""}-${id}.latex`;
    return new LatexTemplate(
      { id, name: titlePageName, filename, owner, isPublic: false },
      true,
    );
  }

  getId(): string {
    return this._id;
  }

  getFilename(): string {
    return this._filename;
  }

  getName(): string {
    return this._name;
  }

  isNew(): boolean {
    return this._isNew;
  }

  getThumbnail(): string {
    return this._thumbnail;
  }

  setThumbnail(thumbnail: string) {
    this._thumbnail = thumbnail;
  }

  getOwner() {
    return this._owner;
  }

  getPublic() {
    return this._isPublic;
  }

  setPublic(isPublic: boolean) {
    this._isPublic = isPublic;
  }
}
