import { singleton } from "tsyringe";
import MinioService from "../../infrastructure/minio.service";
import TitlePageRepository from "../../infrastructure/title-page/title-page.repository";
import writeFileWithDir from "../../utils/write-file-with-dir";
import PdfCoverExtractor from "../pdf-cover-extractor";
import UserService from "../user/user.service";
import TitlePage from "./title-page";

@singleton()
export default class TitlePageService {
  constructor(
    private readonly _repo: TitlePageRepository,
    private readonly _minio: MinioService,
    private readonly _userService: UserService,
    private readonly _coverExtractor: PdfCoverExtractor,
  ) {}

  async handleTitlePageCreate(file: File) {
    const user = await this._userService.getCurrentUserOrRedirectToAuth();
    const titlePage = TitlePage.create(user.getId()!, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const localFilePath = this._minio.getTempPath(titlePage.getFilename());
    const thumbnailPath = this._minio.getTempPath(titlePage.getThumbnail());
    await writeFileWithDir(localFilePath, buffer);
    await this._coverExtractor.getPDFCover(localFilePath, thumbnailPath);

    await this._minio.uploadFile(localFilePath, titlePage.getFilename());
    await this._minio.uploadFile(thumbnailPath, titlePage.getThumbnail());

    await this._repo.save(titlePage);
    return { message: "Титульный лист успешно добавлен", ok: true };
  }

  async getUserTitlePages(userId: number) {
    return this._repo.getByOwnerId(userId);
  }

  public async delete(userId: number, id: string) {
    const doc = await this._repo.getById(id);
    if (doc?.getUserId() != userId)
      throw new Error("Пользователь не является владельцем титульного листа");
    await this._repo.deleteById(id);
  }
}
