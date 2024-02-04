import { v4 as uuidv4 } from "uuid";
import { singleton } from "tsyringe";
import Session from "../../domain/session/session";
import DB from "../common/db";
import UserSchema from "../user/user.schema";
import SessionMapper from "./session.mapper";
import SessionQueryBuilder from "./session.query-builder";
import SessionSchema from "./session.schema";

@singleton()
export default class SessionRepository {
  constructor(
    private readonly _db: DB,
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
    const result = await this._db.query<UserSchema & SessionSchema>(this._sessionQueryBuilder.findById(id));
    if (result.rows[0]) {
      return this._sessionMapper.sessionSchemaWithUserSchemaToEntity(result.rows[0]);
    }
    return undefined;
  }
}
