import { singleton } from "tsyringe";
import SessionManager from "../../app/session/session-manager";
import UserDocumentRepository from "../../infrastructure/user-document/user-document.repository";
import UserDocument from "./user-document";

@singleton()
export default class UserDocumentService {
  constructor(private readonly _repo: UserDocumentRepository, private readonly _sessionManager: SessionManager) {}

  async createDocument(name: string): Promise<UserDocument> {
    const user = await this._sessionManager.getCurrentUserOrThrow();
    const newDocument = UserDocument.create(user, name);
    newDocument.writeMd("# Пример");
    return this._repo.save(newDocument);
  }
}
