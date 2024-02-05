"use server";

import "reflect-metadata";
import { container } from "tsyringe";
import MDToPDFConverter from "../../../domain/md-to-pdf-converter";
import UserDocumentRepository from "../../../infrastructure/user-document/user-document.repository";

const documentRepo = container.resolve(UserDocumentRepository);
const converter = container.resolve(MDToPDFConverter);

export default async function handleUpdateMd(documentId: string, newMd: string) {
  const doc = await documentRepo.getById(documentId);
  if (!doc) throw new Error("Document not found");
  await doc.writeMd(newMd);
  await converter.convert(doc.getLocalMdFilePath(), doc.getLocalPdfFilePath());
}
