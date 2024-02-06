"use server";

import { writeFile } from "fs/promises";
import { container } from "tsyringe";
import TitlePage from "../../domain/title-page/title-page";
import TitlePageRepository from "../../infrastructure/title-page/title-page.repository";

export type ActionResult = { message: string; ok: boolean };

const titlePageRepo = container.resolve(TitlePageRepository);

export default async function handleCreateTitlePage(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const file = formData.get("file") as File | undefined;
  if (!file) return { message: "Файл не прикреплен", ok: false };
  if (!file.name.endsWith(".pdf")) return { message: "Файл должен быть pdf файлом", ok: false };
  const bytes = await file.arrayBuffer();

  const titlePage = TitlePage.create(file.name);
  await writeFile(`public/${titlePage.getFilename()}`, Buffer.from(bytes));
  await titlePageRepo.save(titlePage);
  return { message: "Успешно", ok: true };
}
