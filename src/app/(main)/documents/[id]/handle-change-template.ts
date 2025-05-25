"use server";

import container from "@/container";
import "reflect-metadata";
import UserDocumentService from "../../../../domain/user-document/user-document.service";

const userDocumentService = container.resolve(UserDocumentService);

export default async function handleChangeTemplate(
  documentId: string,
  newTemplateId: string | undefined,
) {
  await userDocumentService.updateDocTemplate(documentId, newTemplateId);
}
