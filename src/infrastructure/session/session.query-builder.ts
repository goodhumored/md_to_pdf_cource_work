import { singleton } from "tsyringe";
import SessionSchema from "./session.schema";

@singleton()
export default class SessionQueryBuilder {
  findById(id: string) {
    return `SELECT * FROM sessions LEFT JOIN users ON users.id = sessions.user_id WHERE sessions.id = '${id}'`;
  }

  insert(sessionSchema: SessionSchema) {
    return `INSERT INTO sessions (id, user_id, last_used, created_at) VALUES ('${sessionSchema.id}', ${
      sessionSchema.user_id
    }, '${sessionSchema.last_used.toISOString()}', '${sessionSchema.created_at.toISOString()}') RETURNING id`;
  }

  update(sessionSchema: SessionSchema) {
    return `UPDATE sessions SET user_id=${sessionSchema.user_id} last_used=${sessionSchema.last_used} created_at=${sessionSchema.created_at} WHERE id='${sessionSchema.id}'`;
  }
}
