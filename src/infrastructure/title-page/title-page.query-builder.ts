import { singleton } from "tsyringe";
import UserSchema from "./title-page.schema";

@singleton()
export default class TitlePageQueryBuilder {
  insert(userSchema: UserSchema) {
    return `INSERT INTO title_pages (id, name, filename) VALUES ('${userSchema.id}', '${userSchema.name}', '${userSchema.filename}') RETURNING id`;
  }

  findById(id: string) {
    return `SELECT * FROM title_pages WHERE id = '${id}'`;
  }

  findAll() {
    return `SELECT * FROM title_pages`;
  }

  update(userSchema: UserSchema) {
    return `UPDATE title_pages SET name='${userSchema.name}' filename='${userSchema.filename}' WHERE id='${userSchema.id}'`;
  }
}
