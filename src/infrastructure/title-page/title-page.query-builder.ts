import { singleton } from "tsyringe";
import { dbInsertStringify } from "../../utils/db-insert-stringify";
import { dbUpdateStringify } from "../../utils/db-update-stringify";
import UserSchema from "./title-page.schema";

@singleton()
export default class TitlePageQueryBuilder {
  insert(userSchema: UserSchema) {
    return `INSERT INTO title_pages ${dbInsertStringify(userSchema)} RETURNING id`;
  }

  findById(id: string) {
    return `SELECT * FROM title_pages WHERE id = '${id}'`;
  }

  findAll() {
    return `SELECT * FROM title_pages`;
  }

  update(userSchema: UserSchema) {
    return `UPDATE title_pages SET ${dbUpdateStringify(userSchema)} WHERE id='${userSchema.id}'`;
  }
}
