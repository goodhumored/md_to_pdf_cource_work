import { createHash } from "crypto";
import { singleton } from "tsyringe";
import SessionManager from "../../app/session/session-manager";
import UserRepository from "../../infrastructure/user/user.repository";
import User from "./user";

@singleton()
export default class UserService {
  constructor(private readonly _repo: UserRepository, private readonly _sessionManager: SessionManager) {}

  async register(username: string, password: string) {
    if (await this._repo.findByUsername(username)) throw Error("Это имя пользователя уже занято");
    const user = User.create(username, createHash("sha256").update(password).digest("hex"));
    const savedUser = await this._repo.save(user);
    return this._sessionManager.startNewSession(savedUser);
  }

  async auth(username: string, password: string) {
    const user = await this._repo.findByCredentials(username, createHash("sha256").update(password).digest("hex"));
    if (user) return this._sessionManager.startNewSession(user);
    return undefined;
  }
}
