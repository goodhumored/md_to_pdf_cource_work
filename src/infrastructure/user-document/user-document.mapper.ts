import { singleton } from "tsyringe";
import UserDocument from "../../domain/user-document/user-document";
import User from "../../domain/user/user";
import UserDocumentSchema from "./user-document.schema";

@singleton()
export default class UserDocumentMapper {
  entityToSchema(userDocument: UserDocument): UserDocumentSchema {
    return {
      id: userDocument.getId(),
      owner_id: userDocument.getOwner().getId()!,
      updated_at: userDocument.getUpdatedAt(),
      created_at: userDocument.getCreatedAt(),
      md_file_name: userDocument.getLocalMdFilePath(),
      pdf_file_name: userDocument.getLocalPdfFilePath(),
      name: userDocument.getName()
    };
  }

  userDocumentSchemaToEntity(userDocument: UserDocumentSchema, user: User) {
    return new UserDocument({
      id: userDocument.id,
      createdAt: userDocument.created_at,
      updatedAt: userDocument.updated_at,
      name: userDocument.name,
      pdfPath: userDocument.pdf_file_name,
      mdPath: userDocument.md_file_name,
      owner: user
    });
  }
}
