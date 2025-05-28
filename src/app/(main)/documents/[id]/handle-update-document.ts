/* eslint-disable @typescript-eslint/no-base-to-string */
"use server";

import { container } from "tsyringe";
import UserDocumentService from "../../../../domain/user-document/user-document.service";
import schema from "./update-document-schema";

export type ActionResult = { message: string; ok: boolean; id?: string };

const userDocumentService = container.resolve(UserDocumentService);

export default async function handleUpdateDocument(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  console.log(Object.fromEntries(formData.entries()));
  const name = formData.get("name");
  const title = formData.get("title")?.toString();
  const template = formData.get("template")?.toString();
  const id = formData.get("id")?.toString();
  const res = schema.validate({ id, name });
  if (res.error) return { message: res.error.message, ok: false };
  const data = res.value;
  await userDocumentService.updateUserDoc(
    data.id,
    data.name,
    template !== "undefined" ? template : undefined,
    title !== "undefined" ? title : undefined,
  );

  return { message: "Документ успешно обновлён!", ok: true };
}
