"use server";

import { container } from "tsyringe";
import TitlePageService from "../../../domain/title-page/titl-page.service";

export type ActionResult = { message: string; ok: boolean };

const titlePageService = container.resolve(TitlePageService);

export default async function handleCreateTitlePage(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const file = formData.get("file") as File | undefined;
  if (!file) return { message: "Файл не прикреплен", ok: false };
  if (!file.name.endsWith(".pdf"))
    return { message: "Файл должен быть pdf файлом", ok: false };
  return titlePageService.handleTitlePageCreate(file);
}
