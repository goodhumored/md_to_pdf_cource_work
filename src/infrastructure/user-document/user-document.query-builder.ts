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
    const { id, owner_id, name, pdf_file_name, md_file_name, template_id, title_page_id, updated_at, created_at } =
      userDocumentSchema;
    return `INSERT INTO user_documents (id, owner_id, name, pdf_file_name, md_file_name, template_id, title_page_id, updated_at, created_at) VALUES ('${id}', ${owner_id}, '${name}', '${pdf_file_name}', '${md_file_name}', ${
      template_id ? `'${template_id}'` : null
    }, ${
      title_page_id ? `'${title_page_id}'` : null
    }, '${updated_at.toISOString()}', '${created_at.toISOString()}') RETURNING id`;
  }

  update(s: UserDocumentSchema) {
    return `UPDATE user_documents SET owner_id=${s.owner_id}, name='${s.name}', pdf_file_name='${
      s.pdf_file_name
    }', md_file_name='${s.md_file_name}', template_id=${s.template_id ? `'${s.template_id}'` : null}, title_page_id=${
      s.title_page_id ? `'${s.title_page_id}'` : null
    }, updated_at='${s.updated_at.toISOString()}', created_at='${s.created_at.toISOString()}' WHERE id='${s.id}'`;
  }

  deleteById(id: string) {
    return `DELETE FROM user_documents WHERE id = '${id}'`;
  }
}
