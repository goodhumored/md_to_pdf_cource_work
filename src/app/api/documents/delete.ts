"use server";

import { container } from "tsyringe";
import UserDocumentService from "../../../domain/user-document/user-document.service";
import UserService from "../../../domain/user/user.service";
const documentService = container.resolve(UserDocumentService);
const userService = container.resolve(UserService);

export default async function DeleteDocument(id: string) {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  await documentService.deleteDocument(user.getId()!, id);
}
