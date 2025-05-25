import { v4 } from "uuid";

export default class TitlePage {
  private _id: string;

  private _name: string;

  private _filename: string;

  private _isNew: boolean;

  private _url?: string;

  private _thumbnail?: string;

  constructor(
    data: {
      id: string;
      name: string;
      filename: string;
      url: string;
      thumbnail?: string | undefined;
    },
    isNew = false,
  ) {
    this._id = data.id;
    this._name = data.name;
    this._filename = data.filename;
    this._isNew = isNew;
    this._url = data.url;
    if (data.thumbnail) this._thumbnail = data.thumbnail;
  }

  static create(name?: string) {
    const id = v4();
    const titlePageName = name ?? id;
    const filename = `title-${name?.replace(".pdf", "") ?? ""}-${id}.pdf`;
    return new TitlePage({ id, name: titlePageName, filename, url: "" }, true);
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

  getUrl(): string | undefined {
    return this._url;
  }

  setUrl(url: string) {
    this._url = url;
  }

  getThumbnail(): string | undefined {
    return this._thumbnail;
  }

  setThumbnail(thumbnail: string) {
    this._thumbnail = thumbnail;
  }
}
