import { rm } from "fs/promises";
import { singleton } from "tsyringe";
import LatexTemplateRepository from "../../infrastructure/latex-template/latex-template.repository";
import MinioService from "../../infrastructure/minio.service";
import writeFileWithDir from "../../utils/write-file-with-dir";
import MDToPDFConverter from "../md-to-pdf-converter";
import PdfCoverExtractor from "../pdf-cover-extractor";
import UserService from "../user/user.service";
import LatexTemplate from "./latex-template";

@singleton()
export default class TemplateService {
  constructor(
    private readonly _repo: LatexTemplateRepository,
    private readonly _minio: MinioService,
    private readonly _userService: UserService,
    private readonly _converter: MDToPDFConverter,
    private readonly _coverExtractor: PdfCoverExtractor,
  ) {}

  async handleTitlePageCreate(file: File) {
    const user = await this._userService.getCurrentUserOrRedirectToAuth();
    const template = LatexTemplate.create(user.getId()!, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const localFilePath = this._minio.getTempPath(template.getFilename());
    const thumbnailPath = this._minio.getTempPath(template.getThumbnail());
    const mdPath = this._minio.getTempPath(template.getId() + ".md");
    const testPdfPath = this._minio.getTempPath(template.getId() + ".pdf");

    await writeFileWithDir(localFilePath, buffer);
    await writeFileWithDir(mdPath, Buffer.from(TEMPLATE_EXAMPLE_TEXT));

    await this._converter.convert(
      mdPath,
      testPdfPath,
      undefined,
      localFilePath,
    );
    await this._coverExtractor.getPDFCover(testPdfPath, thumbnailPath);

    await this._minio.uploadFile(localFilePath, template.getFilename());
    await this._minio.uploadFile(thumbnailPath, template.getThumbnail());

    await this._repo.save(template);

    await Promise.all(
      [mdPath, testPdfPath, localFilePath, thumbnailPath].map((f) => rm(f)),
    );
    return { message: "Шаблон успешно добавлен", ok: true };
  }

  getUserTemplates(userId: number) {
    return this._repo.getByOwnerId(userId);
  }

  public async delete(userId: number, id: string) {
    const templ = await this._repo.getById(id);
    if (templ?.getOwner() != userId)
      throw new Error("Пользователь не является владельцем титульного листа");
    await this._repo.deleteById(id);
  }
}

const TEMPLATE_EXAMPLE_TEXT = `
# Пример оформления

Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae, tempora ut! Beatae doloribus soluta incidunt, dolore temporibus rerum accusantium assumenda eveniet voluptatibus sequi? Mollitia neque, nostrum eius dignissimos delectus aperiam.


## Заголовок 2:

- Элемент 1
  - Элемент 3

### Нумерованный список (Заголовок 3):

1. Элемент 1
2. Элемент 2
  a. Элемент 3

#### Математика (Заголовок 4):

$$
S \\rightarrow \\mathbf{a :=} F \\mathbf{;} \\
$$

##### Изображение (Заголовок 5):

![Тестовое изображение](https://images.unsplash.com/photo-1506744038136-46273834b3fb?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHNjYXBlfGVufDB8fDB8fHww)

###### Таблица (Заголовок 6):

|    | a | := | ( | ) | not | or | xor | and | ; |
|----|---|----|---|---|-----|----|-----|-----|---|
| a  |   | =  |   | > |     | >  |  >  |  >  | > |
| := | < |    | < | < |  <  | <  |  <  |  <  | = |

***

`;
