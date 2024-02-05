import { singleton } from "tsyringe";
import UserDocument from "../../domain/user-document/user-document";
import DB from "../common/db";
import UserRepository from "../user/user.repository";
import UserDocumentMapper from "./user-document.mapper";
import UserDocumentQueryBuilder from "./user-document.query-builder";
import UserDocumentSchema from "./user-document.schema";

@singleton()
export default class UserDocumentRepository {
  constructor(
    private readonly _db: DB,
    private readonly _userRepo: UserRepository,
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
    return Promise.all(
      result.rows.map((row) =>
        this._userRepo
          .getById(row.owner_id)
          .then((user) => this._userDocumentMapper.userDocumentSchemaToEntity(row, user!))
      )
    );
  }

  async getById(id: string): Promise<UserDocument | undefined> {
    const result = await this._db.query<UserDocumentSchema>(this._userDocumentQueryBuilder.findById(id));
    if (result.rows[0]) {
      const user = await this._userRepo.getById(result.rows[0].owner_id);
      return this._userDocumentMapper.userDocumentSchemaToEntity(result.rows[0], user!);
    }
    return undefined;
  }

  deleteById(id: string): Promise<void> {
    return this._db.query(this._userDocumentQueryBuilder.deleteById(id)).then(() => {});
  }
}
