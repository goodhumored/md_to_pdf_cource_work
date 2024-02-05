import { singleton } from "tsyringe";
import SessionSchema from "./session.schema";

@singleton()
export default class SessionQueryBuilder {
  findById(id: string) {
    return `SELECT * FROM sessions WHERE id = '${id}'`;
  }

  insert(sessionSchema: SessionSchema) {
    return `INSERT INTO sessions (id, user_id, last_used, created_at) VALUES ('${sessionSchema.id}', ${
      sessionSchema.user_id
    }, '${sessionSchema.last_used.toISOString()}', '${sessionSchema.created_at.toISOString()}') RETURNING id`;
  }

  update(sessionSchema: SessionSchema) {
    return `UPDATE sessions SET user_id=${
      sessionSchema.user_id
    }, last_used='${sessionSchema.last_used.toISOString()}', created_at='${sessionSchema.created_at.toISOString()}' WHERE id='${
      sessionSchema.id
    }'`;
  }

  deleteById(id: string) {
    return `DELETE FROM sessions WHERE id = '${id}'`;
  }
}
