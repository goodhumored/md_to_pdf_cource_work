import { singleton } from "tsyringe";
import LatexTemplateSchema from "./latex-template.schema";

@singleton()
export default class LatexTemplateQueryBuilder {
  insert(userSchema: LatexTemplateSchema) {
    return `INSERT INTO templates (id, name, filename) VALUES ('${userSchema.id}', '${userSchema.name}', '${userSchema.filename}') RETURNING id`;
  }

  findById(id: string) {
    return `SELECT * FROM templates WHERE id = '${id}'`;
  }

  findAll() {
    return `SELECT * FROM templates`;
  }

  update(userSchema: LatexTemplateSchema) {
    return `UPDATE templates SET name='${userSchema.name}' filename='${userSchema.filename}' WHERE id='${userSchema.id}'`;
  }
}
