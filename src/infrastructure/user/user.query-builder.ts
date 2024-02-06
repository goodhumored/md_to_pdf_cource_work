import { singleton } from "tsyringe";
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

  insert(userSchema: UserSchema) {
    return `INSERT INTO users (username, password_hash) VALUES ('${userSchema.username}', '${userSchema.password_hash}') RETURNING id`;
  }

  update(userSchema: UserSchema) {
    return `UPDATE users SET username='${userSchema.username}' password_hash='${userSchema.password_hash}' WHERE id=${userSchema.id}`;
  }
}
