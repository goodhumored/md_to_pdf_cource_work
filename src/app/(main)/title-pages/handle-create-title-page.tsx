"use server";

import { container } from "tsyringe";
import TitlePage from "../../../domain/title-page/title-page";
import TitlePageRepository from "../../../infrastructure/title-page/title-page.repository";
import FileManager from "../../../domain/file-manager";

export type ActionResult = { message: string; ok: boolean };

const titlePageRepo = container.resolve(TitlePageRepository);
const fileManager = container.resolve(FileManager);

export default async function handleCreateTitlePage(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const file = formData.get("file") as File | undefined;
  if (!file) return { message: "Файл не прикреплен", ok: false };
  if (!file.name.endsWith(".pdf")) return { message: "Файл должен быть pdf файлом", ok: false };

  const titlePage = TitlePage.create(file.name);
  const url = await fileManager.uploadFile(titlePage.getFilename(), file);
  titlePage.setUrl(url);
  await titlePageRepo.save(titlePage);
  return { message: "Титульный лист успешно добавлен", ok: true };
}
