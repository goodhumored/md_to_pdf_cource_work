"use server";

import "reflect-metadata";
import { container } from "tsyringe";
import MDToPDFConverter from "../../../domain/md-to-pdf-converter";
import TitlePageRepository from "../../../infrastructure/title-page/title-page.repository";
import UserDocumentRepository from "../../../infrastructure/user-document/user-document.repository";

const documentRepo = container.resolve(UserDocumentRepository);
const titleRepo = container.resolve(TitlePageRepository);
const converter = container.resolve(MDToPDFConverter);

export default async function handleChangeTitle(documentId: string, newTitleId: string | undefined) {
  const doc = await documentRepo.getById(documentId);
  if (!doc) throw new Error("Document not found");
  if (newTitleId) {
    const title = await titleRepo.getById(newTitleId);
    if (!title) throw new Error("Title not found");
    doc.setTitlePage(title);
  } else doc.setTitlePage(undefined);
  await Promise.all([documentRepo.save(doc), converter.convertUserDoc(doc)]);
}
