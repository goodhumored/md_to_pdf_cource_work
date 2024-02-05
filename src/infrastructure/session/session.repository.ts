import { singleton } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import Session from "../../domain/session/session";
import User from "../../domain/user/user";
import DB from "../common/db";
import UserRepository from "../user/user.repository";
import SessionMapper from "./session.mapper";
import SessionQueryBuilder from "./session.query-builder";
import SessionSchema from "./session.schema";

@singleton()
export default class SessionRepository {
  constructor(
    private readonly _db: DB,
    private readonly _userRepo: UserRepository,
    private readonly _sessionMapper: SessionMapper,
    private readonly _sessionQueryBuilder: SessionQueryBuilder
  ) {}

  async save(session: Session): Promise<Session> {
    const schema = this._sessionMapper.entityToSchema(session);
    if (session.getId() === undefined) {
      schema.id = uuidv4();
      await this._db.query(this._sessionQueryBuilder.insert(schema));
      return this._sessionMapper.sessionSchemaToEntity(schema, session.getUser());
    }
    await this._db.query(this._sessionQueryBuilder.update(schema));
    return session;
  }

  async getById(id: string): Promise<Session | undefined> {
    const result = await this._db.query<SessionSchema>(this._sessionQueryBuilder.findById(id));
    if (result.rows[0]) {
      let user: User | undefined;
      if (result.rows[0].user_id) user = await this._userRepo.getById(result.rows[0].user_id);
      return this._sessionMapper.sessionSchemaToEntity(result.rows[0], user);
    }
    return undefined;
  }

  deleteById(id: string): Promise<void> {
    return this._db.query(this._sessionQueryBuilder.deleteById(id)).then(() => {});
  }
}
