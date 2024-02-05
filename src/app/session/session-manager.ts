import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { singleton } from "tsyringe";
import Session from "../../domain/session/session";
import User from "../../domain/user/user";
import SessionRepository from "../../infrastructure/session/session.repository";

@singleton()
export default class SessionManager {
  constructor(private readonly _sessionRepository: SessionRepository) {}

  getSession(request?: NextRequest): Promise<Session | undefined> {
    const cookieStorage = request?.cookies ?? cookies();
    const sessionId = cookieStorage.get("session_id")?.value;
    if (!sessionId) return Promise.resolve(undefined);
    const sessionResponse = this._sessionRepository.getById(sessionId);
    return sessionResponse.then((session) => {
      if (session) {
        session.updateLastUsed();
        this._sessionRepository.save(session).catch(() => {});
      }
      return session;
    });
  }

  getOrStartSession(request: NextRequest): Promise<Session> {
    return this.getSession(request).then((session) => {
      if (!session) {
        return this.startNewSession();
      }
      return session;
    });
  }

  async startNewSession(user?: User): Promise<Session> {
    const newSession = await this._sessionRepository.save(Session.create(user));
    cookies().set("session_id", newSession.getId()!);
    return newSession;
  }

  async logoutSession(request?: NextRequest): Promise<void> {
    const session = await this.getSession(request);
    if (session) await this._sessionRepository.deleteById(session.getId()!);
  }
}
