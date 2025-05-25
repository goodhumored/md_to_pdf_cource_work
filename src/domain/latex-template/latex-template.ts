import { v4 } from "uuid";

export default class LatexTemplate {
  private _id: string;

  private _name: string;

  private _filename: string;

  private _isNew: boolean;

  private _thumbnail?: string;

  constructor(
    data: {
      id: string;
      name: string;
      filename: string;
      thumbnail?: string | undefined;
    },
    isNew = false,
  ) {
    this._id = data.id;
    this._name = data.name;
    this._filename = data.filename;
    if (data.thumbnail) this._thumbnail = data.thumbnail;
    this._isNew = isNew;
  }

  static create(name?: string) {
    const id = v4();
    const titlePageName = name ?? id;
    const filename = `template-${name?.replace(".latex", "") ?? ""}-${id}.latex`;
    return new LatexTemplate({ id, name: titlePageName, filename }, true);
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

  getThumbnail(): string | undefined {
    return this._thumbnail;
  }

  setThumbnail(thumbnail: string) {
    this._thumbnail = thumbnail;
  }
}
