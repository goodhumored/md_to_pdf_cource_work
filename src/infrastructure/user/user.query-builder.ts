import { singleton } from "tsyringe";
import { dbInsertStringify } from "../../utils/db-insert-stringify";
import { dbUpdateStringify } from "../../utils/db-update-stringify";
import UserSchema from "./user.schema";

@singleton()
export default class UserQueryBuilder {
  findById(id: number) {
    return `SELECT * FROM users WHERE id = ${id}`;
  }

  findByCredentials(username: string, passwordHash: string) {
    return `SELECT * FROM users WHERE username = '${username}' AND password_hash = '${passwordHash}'`;
  }

  findByUsername(username: string) {
    return `SELECT * FROM users WHERE username = '${username}'`;
  }

  insert(_userSchema: UserSchema) {
    const userSchema = _userSchema;
    delete userSchema.id;
    return `INSERT INTO users ${dbInsertStringify(userSchema)} RETURNING id`;
  }

  update(userSchema: UserSchema) {
    return `UPDATE users SET ${dbUpdateStringify(userSchema)} WHERE id=${userSchema.id}`;
  }
}
