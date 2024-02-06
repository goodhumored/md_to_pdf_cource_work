"use server";

import "reflect-metadata";
import { container } from "tsyringe";
import MDToPDFConverter from "../../../domain/md-to-pdf-converter";
import LatexTemplateRepository from "../../../infrastructure/latex-template/latex-template.repository";
import UserDocumentRepository from "../../../infrastructure/user-document/user-document.repository";

const documentRepo = container.resolve(UserDocumentRepository);
const templateRepo = container.resolve(LatexTemplateRepository);
const converter = container.resolve(MDToPDFConverter);

export default async function handleChangeTemplate(documentId: string, newTemplateId: string | undefined) {
  const doc = await documentRepo.getById(documentId);
  if (!doc) throw new Error("Document not found");
  if (newTemplateId) {
    const template = await templateRepo.getById(newTemplateId);
    if (!template) throw new Error("Template not found");
    doc.setLatexTemplate(template);
  } else doc.setLatexTemplate(undefined);
  await Promise.all([documentRepo.save(doc), converter.convertUserDoc(doc)]);
}
