import { singleton } from "tsyringe";
import { dbInsertStringify } from "../../utils/db-insert-stringify";
import { dbUpdateStringify } from "../../utils/db-update-stringify";
import UserDocumentSchema from "./user-document.schema";

@singleton()
export default class UserDocumentQueryBuilder {
  findById(id: string) {
    return `SELECT * FROM user_documents WHERE id = '${id}'`;
  }

  findByOwnerId(ownerId: number) {
    return `SELECT * FROM user_documents WHERE owner_id = ${ownerId}`;
  }

  insert(userDocumentSchema: UserDocumentSchema) {
    return `INSERT INTO user_documents ${dbInsertStringify(userDocumentSchema)} RETURNING id`;
  }

  update(s: UserDocumentSchema) {
    console.log(
      `UPDATE user_documents SET ${dbUpdateStringify(s)} WHERE id='${s.id}'`,
    );
    return `UPDATE user_documents SET ${dbUpdateStringify(s)} WHERE id='${s.id}'`;
  }

  deleteById(id: string) {
    return `DELETE FROM user_documents WHERE id = '${id}'`;
  }
}
