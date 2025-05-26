"use server";

import { container } from "tsyringe";
import TemplateService from "../../../domain/latex-template/template.service";

export type ActionResult = { message: string; ok: boolean; template?: { id: string; name: string } };

const templateService = container.resolve(TemplateService);

export default async function handleCreateTemplate(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const file = formData.get("file") as File | undefined;
  if (!file) return { message: "Файл не прикреплен", ok: false };
  if (!file.name.endsWith(".latex")) return { message: "Файл должен быть шаблоном LaTex", ok: false };

  await templateService.handleTitlePageCreate(file);
  return { message: "Успешно", ok: true };
}
