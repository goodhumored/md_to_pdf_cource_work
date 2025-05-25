"use server";

import container from "@/container";
import "reflect-metadata";
import UserDocumentService from "../../../../domain/user-document/user-document.service";

const documentService = container.resolve(UserDocumentService);

export default async function handleUpdateMd(
  documentId: string,
  newMd: string,
) {
  await documentService.updateUserDocMarkdown(documentId, newMd);
}
