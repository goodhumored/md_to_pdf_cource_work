import { singleton } from "tsyringe";
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
    return `INSERT INTO user_documents (id, owner_id, name, pdf_file_name, md_file_name, updated_at, created_at) VALUES ('${
      userDocumentSchema.id
    }', ${userDocumentSchema.owner_id}, '${userDocumentSchema.name}', '${userDocumentSchema.pdf_file_name}', '${
      userDocumentSchema.md_file_name
    }', '${userDocumentSchema.updated_at.toISOString()}', '${userDocumentSchema.created_at.toISOString()}') RETURNING id`;
  }

  update(userDocumentSchema: UserDocumentSchema) {
    return `UPDATE user_documents SET owner_id=${userDocumentSchema.owner_id}, name='${
      userDocumentSchema.name
    }', pdf_file_name='${userDocumentSchema.pdf_file_name}', md_file_name='${
      userDocumentSchema.md_file_name
    }', updated_at='${userDocumentSchema.updated_at.toISOString()}', created_at='${userDocumentSchema.created_at.toISOString()}' WHERE id='${
      userDocumentSchema.id
    }'`;
  }

  deleteById(id: string) {
    return `DELETE FROM user_documents WHERE id = '${id}'`;
  }
}
