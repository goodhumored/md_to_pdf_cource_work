import { singleton } from "tsyringe";
import TitlePage from "../../domain/title-page/title-page";
import TitlePageSchema from "./title-page.schema";

@singleton()
export default class TitlePageMapper {
  schemaToEntity(titlePage: TitlePageSchema) {
    return new TitlePage({
      id: titlePage.id,
      name: titlePage.name,
      filename: titlePage.filename
    });
  }

  entityToSchema(titlePage: TitlePage): TitlePageSchema {
    return {
      id: titlePage.getId(),
      name: titlePage.getName(),
      filename: titlePage.getFilename()
    };
  }
}
