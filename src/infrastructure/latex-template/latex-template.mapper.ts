import { singleton } from "tsyringe";
import LatexTemplate from "../../domain/latex-template/latex-template";
import LatexTemplateSchema from "./latex-template.schema";

@singleton()
export default class LatexTemplateMapper {
  schemaToEntity(latexTemplate: LatexTemplateSchema) {
    return new LatexTemplate({
      id: latexTemplate.id,
      name: latexTemplate.name,
      filename: latexTemplate.filename,
      thumbnail: latexTemplate.thumbnail,
    });
  }

  entityToSchema(latexTemplate: LatexTemplate): LatexTemplateSchema {
    return {
      id: latexTemplate.getId(),
      name: latexTemplate.getName(),
      filename: latexTemplate.getFilename(),
      thumbnail: latexTemplate.getThumbnail(),
    };
  }
}
