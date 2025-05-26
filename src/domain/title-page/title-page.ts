import { v4 } from "uuid";

export default class TitlePage {
  private _id: string;

  private _name: string;

  private _filename: string;

  private _isNew: boolean;

  private _url?: string;

  private _thumbnail: string;

  private _userId: number;

  constructor(
    data: {
      id: string;
      name: string;
      filename: string;
      userId: number;
      thumbnail: string;
    },
    isNew = false,
  ) {
    this._id = data.id;
    this._name = data.name;
    this._filename = data.filename;
    this._isNew = isNew;
    this._userId = data.userId;
    this._thumbnail = data.thumbnail;
  }

  static create(userId: number, name?: string) {
    const id = v4();
    const titlePageName = name ?? id;
    const filename = `${userId}/${name?.replace(".pdf", "") ?? ""}-${id}.pdf`;
    return new TitlePage(
      {
        id,
        name: titlePageName,
        filename,
        userId,
        thumbnail: filename.replace(".pdf", "").concat(".webp"),
      },
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

  getUrl(): string | undefined {
    return this._url;
  }

  setUrl(url: string) {
    this._url = url;
  }

  getThumbnail(): string {
    return this._thumbnail;
  }

  setThumbnail(thumbnail: string) {
    this._thumbnail = thumbnail;
  }

  getUserId(): number {
    return this._userId;
  }
}
