import { singleton } from "tsyringe";
import Session from "../../domain/session/session";
import User from "../../domain/user/user";
import UserMapper from "../user/user.mapper";
import UserSchema from "../user/user.schema";
import SessionSchema from "./session.schema";

@singleton()
export default class SessionMapper {
  constructor(private readonly _userMapper: UserMapper) {}

  entityToSchema(session: Session): SessionSchema {
    return {
      id: session.getId() ?? null,
      user_id: session.getUser()?.getId() ?? null,
      last_used: session.getLastUsedTime(),
      created_at: session.getStartTime()
    };
  }

  sessionSchemaWithUserSchemaToEntity(session: SessionSchema & Partial<UserSchema>) {
    let user: User | undefined;
    if (session.user_id) {
      user = this._userMapper.schemaToEntity({
        id: session.user_id,
        password_hash: session.password_hash!,
        username: session.username!
      });
    }
    return this.sessionSchemaToEntity(session, user);
  }

  sessionSchemaToEntity(session: SessionSchema, user?: User | undefined) {
    return new Session({
      id: session.id ?? undefined,
      lastUsed: session.last_used,
      startTime: session.created_at,
      user
    });
  }
}
