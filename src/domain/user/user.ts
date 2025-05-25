export default class User {
  private id: number | undefined;

  private _username: string;

  private _passwordHash: string;

  constructor(data: {
    id?: number | undefined;
    username: string;
    passwordHash: string;
  }) {
    this.id = data.id;
    this._username = data.username;
    this._username = data.username;
    this._passwordHash = data.passwordHash;
  }

  static create(username: string, passwordHash: string) {
    return new User({ username, passwordHash });
  }

  getId(): number | undefined {
    return this.id;
  }

  getUsername(): string {
    return this._username;
  }

  getPasswordHash(): string {
    return this._passwordHash;
  }
}
