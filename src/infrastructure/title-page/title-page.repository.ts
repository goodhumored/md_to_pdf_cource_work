import { singleton } from "tsyringe";
import TitlePage from "../../domain/title-page/title-page";
import DB from "../common/db";
import TitlePageMapper from "./title-page.mapper";
import TitlePageQueryBuilder from "./title-page.query-builder";
import TitlePageSchema from "./title-page.schema";

@singleton()
export default class TitlePageRepository {
  constructor(
    private readonly _db: DB,
    private readonly _titlePageMapper: TitlePageMapper,
    private readonly _titlePageQueryBuilder: TitlePageQueryBuilder
  ) {}

  async save(titlePage: TitlePage): Promise<TitlePage> {
    const schema = this._titlePageMapper.entityToSchema(titlePage);
    if (titlePage.isNew()) {
      await this._db.query(this._titlePageQueryBuilder.insert(schema));
    } else await this._db.query(this._titlePageQueryBuilder.update(schema));
    return titlePage;
  }

  async getById(id: string): Promise<TitlePage | undefined> {
    const result = await this._db.query<TitlePageSchema>(this._titlePageQueryBuilder.findById(id));
    if (result.rows[0]) {
      return this._titlePageMapper.schemaToEntity(result.rows[0]);
    }
    return undefined;
  }

  findAll(): Promise<TitlePage[]> {
    return this._db
      .query<TitlePageSchema>(this._titlePageQueryBuilder.findAll())
      .then((result) => Promise.all(result.rows.map((row) => this._titlePageMapper.schemaToEntity(row))));
  }
}
