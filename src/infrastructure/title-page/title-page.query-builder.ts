import { singleton } from "tsyringe";
import { dbInsertStringify } from "../../utils/db-insert-stringify";
import { dbUpdateStringify } from "../../utils/db-update-stringify";
import TitlePageSchema from "./title-page.schema";

@singleton()
export default class TitlePageQueryBuilder {
  insert(s: TitlePageSchema) {
    console.log(`INSERT INTO title_pages ${dbInsertStringify(s)} RETURNING id`);
    return `INSERT INTO title_pages ${dbInsertStringify(s)} RETURNING id`;
  }

  findById(id: string) {
    return `SELECT * FROM title_pages WHERE id = '${id}'`;
  }

  findByOwnerId(ownerId: number) {
    return `SELECT * FROM title_pages WHERE user_id=${ownerId}`;
  }

  findAll() {
    return `SELECT * FROM title_pages`;
  }

  update(s: TitlePageSchema) {
    return `UPDATE title_pages SET ${dbUpdateStringify(s)} WHERE id='${s.id}'`;
  }
}
