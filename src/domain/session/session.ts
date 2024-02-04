import User from "../user/user";

export default class Session {
  private _id: string | undefined;

  private _user: User | undefined;

  private _startTime: Date;

  private _lastUsed: Date;

  constructor(data: { id?: string | undefined; user?: User | undefined; startTime: Date; lastUsed: Date }) {
    this._id = data.id;
    this._user = data.user;
    this._startTime = data.startTime;
    this._lastUsed = data.lastUsed;
  }

  static create(user?: User) {
    return new Session({ user, startTime: new Date(), lastUsed: new Date() });
  }

  getId(): string | undefined {
    return this._id;
  }

  getUser(): User | undefined {
    return this._user;
  }

  assignUser(user: User) {
    this._user = user;
  }

  getStartTime(): Date {
    return this._startTime;
  }

  getLastUsedTime(): Date {
    return this._lastUsed;
  }

  updateLastUsed() {
    this._lastUsed = new Date();
  }
}
