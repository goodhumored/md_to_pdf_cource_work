import { singleton } from "tsyringe";
import { dbInsertStringify } from "../../utils/db-insert-stringify";
import { dbUpdateStringify } from "../../utils/db-update-stringify";
import LatexTemplateSchema from "./latex-template.schema";

@singleton()
export default class LatexTemplateQueryBuilder {
  insert(templateSchema: LatexTemplateSchema) {
    return `INSERT INTO templates ${dbInsertStringify(templateSchema)} RETURNING id`;
  }

  findById(id: string) {
    return `SELECT * FROM templates WHERE id = '${id}'`;
  }

  findAll() {
    return `SELECT * FROM templates`;
  }

  update(templateSchema: LatexTemplateSchema) {
    return `UPDATE templates SET ${dbUpdateStringify(templateSchema)} WHERE id='${templateSchema.id}'`;
  }
}
