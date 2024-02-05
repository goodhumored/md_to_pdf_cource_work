"use server";

import { redirect } from "next/navigation";
import { container } from "tsyringe";
import UserDocumentService from "../../domain/user-document/user-document.service";
import authSchema from "./create-document.validation-schema";

export type ActionResult = { message: string; ok: boolean; id?: string };

const userDocumentService = container.resolve(UserDocumentService);

export default async function handleCreateDocument(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const name = formData.get("name");
  const res = authSchema.validate({ name });
  if (res.error) return { message: res.error.message, ok: false };
  const data = res.value;
  const document = await userDocumentService.createDocument(data.name);

  return redirect(`/documents/${document.getId()}`);
}
