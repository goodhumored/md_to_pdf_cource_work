"use server";

import { writeFile } from "fs/promises";
import { container } from "tsyringe";
import LatexTemplate from "../../domain/latex-template/latex-template";
import LatexTemplateRepository from "../../infrastructure/latex-template/latex-template.repository";

export type ActionResult = { message: string; ok: boolean; template?: { id: string; name: string } };

const templateRepo = container.resolve(LatexTemplateRepository);

export default async function handleCreateTemplate(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const file = formData.get("file") as File | undefined;
  if (!file) return { message: "Файл не прикреплен", ok: false };
  if (!file.name.endsWith(".latex")) return { message: "Файл должен быть шаблоном LaTex", ok: false };
  const bytes = await file.arrayBuffer();

  const template = LatexTemplate.create(file.name);
  await writeFile(`public/${template.getFilename()}`, Buffer.from(bytes));
  await templateRepo.save(template);

  return { message: "Успешно", ok: true };
}
