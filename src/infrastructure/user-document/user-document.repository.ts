import { singleton } from "tsyringe";
import UserDocument from "../../domain/user-document/user-document";
import DB from "../common/db";
import LatexTemplateRepository from "../latex-template/latex-template.repository";
import TitlePageRepository from "../title-page/title-page.repository";
import UserRepository from "../user/user.repository";
import UserDocumentMapper from "./user-document.mapper";
import UserDocumentQueryBuilder from "./user-document.query-builder";
import UserDocumentSchema from "./user-document.schema";

@singleton()
export default class UserDocumentRepository {
  constructor(
    private readonly _db: DB,
    private readonly _userRepo: UserRepository,
    private readonly _titlesRepo: TitlePageRepository,
    private readonly _templatesRepo: LatexTemplateRepository,
    private readonly _userDocumentMapper: UserDocumentMapper,
    private readonly _userDocumentQueryBuilder: UserDocumentQueryBuilder
  ) {}

  async save(userDocument: UserDocument): Promise<UserDocument> {
    const schema = this._userDocumentMapper.entityToSchema(userDocument);
    if (userDocument.isNew()) {
      await this._db.query(this._userDocumentQueryBuilder.insert(schema));
    } else {
      await this._db.query(this._userDocumentQueryBuilder.update(schema));
    }
    return userDocument;
  }

  async getByOwnerId(ownerId: number): Promise<UserDocument[]> {
    const result = await this._db.query<UserDocumentSchema>(this._userDocumentQueryBuilder.findByOwnerId(ownerId));
    return Promise.all(result.rows.map(this.map.bind(this)));
  }

  async getById(id: string): Promise<UserDocument | undefined> {
    const result = await this._db.query<UserDocumentSchema>(this._userDocumentQueryBuilder.findById(id));
    return result.rows[0] ? this.map(result.rows[0]) : undefined;
  }

  deleteById(id: string): Promise<void> {
    return this._db.query(this._userDocumentQueryBuilder.deleteById(id)).then(() => {});
  }

  private async map(row: UserDocumentSchema) {
    const user = await this._userRepo.getById(row.owner_id);
    const [title, template] = await Promise.all([
      row.title_page_id ? this._titlesRepo.getById(row.title_page_id) : undefined,
      row.template_id ? this._templatesRepo.getById(row.template_id) : undefined
    ]);
    return this._userDocumentMapper.userDocumentSchemaToEntity(row, user!, template, title);
  }
}
