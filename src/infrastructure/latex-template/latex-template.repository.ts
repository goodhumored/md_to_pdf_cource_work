import { singleton } from "tsyringe";
import LatexTemplate from "../../domain/latex-template/latex-template";
import DB from "../common/db";
import LatexTemplateMapper from "./latex-template.mapper";
import LatexTemplateQueryBuilder from "./latex-template.query-builder";
import LatexTemplateSchema from "./latex-template.schema";

@singleton()
export default class LatexTemplateRepository {
  constructor(
    private readonly _db: DB,
    private readonly _latexTemplateMapper: LatexTemplateMapper,
    private readonly _queryBuilder: LatexTemplateQueryBuilder,
  ) {}

  async save(latexTemplate: LatexTemplate): Promise<LatexTemplate> {
    const schema = this._latexTemplateMapper.entityToSchema(latexTemplate);
    if (latexTemplate.isNew()) {
      await this._db.query(this._queryBuilder.insert(schema));
    } else await this._db.query(this._queryBuilder.update(schema));
    return latexTemplate;
  }

  async getById(id: string): Promise<LatexTemplate | undefined> {
    const result = await this._db.query<LatexTemplateSchema>(
      this._queryBuilder.findById(id),
    );
    if (result.rows[0]) {
      return this._latexTemplateMapper.schemaToEntity(result.rows[0]);
    }
    return undefined;
  }

  getByOwnerId(ownerId: number): Promise<LatexTemplate[]> {
    return this._db
      .query<LatexTemplateSchema>(this._queryBuilder.byOwnerId(ownerId))
      .then((result) =>
        Promise.all(
          result.rows.map((row) =>
            this._latexTemplateMapper.schemaToEntity(row),
          ),
        ),
      );
  }

  findAll(): Promise<LatexTemplate[]> {
    return this._db
      .query<LatexTemplateSchema>(this._queryBuilder.findAll())
      .then((result) =>
        Promise.all(
          result.rows.map((row) =>
            this._latexTemplateMapper.schemaToEntity(row),
          ),
        ),
      );
  }

  deleteById(id: string): Promise<void> {
    return this._db.query(this._queryBuilder.deleteById(id)).then();
  }
}
