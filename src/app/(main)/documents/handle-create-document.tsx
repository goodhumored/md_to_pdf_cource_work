"use server";

import { container } from "tsyringe";
import UserDocumentService from "../../../domain/user-document/user-document.service";
import authSchema from "./create-document.validation-schema";

export type ActionResult = { message: string; ok: boolean; id?: string };

const userDocumentService = container.resolve(UserDocumentService);

export default async function handleCreateDocument(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const name = formData.get("name");
  const title = formData.get("title")?.toString();
  const existingDocument = formData.get("existing_document") as File;
  const res = authSchema.validate({ name });
  if (res.error) return { message: res.error.message, ok: false };
  const data = res.value;
  await userDocumentService.createDocument(data.name, title !== 'undefined' ? title : undefined, existingDocument);

  return { message: "Документ успешно создан!", ok: true }
}
