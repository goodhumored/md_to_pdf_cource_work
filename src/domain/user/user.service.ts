import { createHash } from "crypto";
import { redirect } from "next/navigation";
import { singleton } from "tsyringe";
import UserRepository from "../../infrastructure/user/user.repository";
import Session from "../session/session";
import SessionManager from "../session/session-manager";
import User from "./user";

@singleton()
export default class UserService {
  constructor(
    private readonly _repo: UserRepository,
    private readonly _sessionManager: SessionManager,
  ) {}

  async createUser(username: string, password: string): Promise<Session> {
    const existingUser = await this._repo.findByUsername(username);
    if (existingUser) throw Error("Это имя пользователя уже занято");

    const passwordHash = createHash("sha256").update(password).digest("hex");
    const user = User.create(username, passwordHash);
    const savedUser = await this._repo.save(user);

    return this._sessionManager.startNewSession(savedUser);
  }

  async auth(username: string, password: string) {
    const passwordHash = createHash("sha256").update(password).digest("hex");
    const user = await this._repo.findByCredentials(username, passwordHash);
    if (user) return this._sessionManager.startNewSession(user);
    return undefined;
  }

  async getCurrentUserOrRedirectToAuth(): Promise<User> {
    const session = await this._sessionManager.getSession();
    const user = session?.getUser();
    if (!user) redirect("/signin");
    return user;
  }
}
