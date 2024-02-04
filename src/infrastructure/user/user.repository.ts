import { singleton } from "tsyringe";
import User from "../../domain/user/user";
import DB from "../common/db";
import UserMapper from "./user.mapper";
import UserQueryBuilder from "./user.query-builder";
import UserSchema from "./user.schema";

@singleton()
export default class UserRepository {
  constructor(
    private readonly _db: DB,
    private readonly _userMapper: UserMapper,
    private readonly _userQueryBuilder: UserQueryBuilder
  ) {}

  async save(user: User): Promise<User> {
    const schema = this._userMapper.entityToSchema(user);
    if (user.getId() === undefined) {
      const result = await this._db.query<{ id: number }>(this._userQueryBuilder.insert(schema));
      schema.id = result.rows[0]?.id;
      return this._userMapper.schemaToEntity(schema);
    }
    await this._db.query(this._userQueryBuilder.update(schema));
    return user;
  }

  async getById(id: number): Promise<User | undefined> {
    const result = await this._db.query<UserSchema>(this._userQueryBuilder.findById(id));
    if (result.rows[0]) {
      return this._userMapper.schemaToEntity(result.rows[0]);
    }
    return undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const result = await this._db.query<UserSchema>(this._userQueryBuilder.findByUsername(username));
    if (result.rows[0]) {
      return this._userMapper.schemaToEntity(result.rows[0]);
    }
    return undefined;
  }

  async findByCredentials(username: string, passwordHash: string): Promise<User | undefined> {
    const result = await this._db.query<UserSchema>(this._userQueryBuilder.findByCredentials(username, passwordHash));
    if (result.rows[0]) {
      return this._userMapper.schemaToEntity(result.rows[0]);
    }
    return undefined;
  }
}
