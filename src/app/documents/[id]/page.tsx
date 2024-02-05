import { redirect } from "next/navigation";
import "reflect-metadata";
import { container } from "tsyringe";
import UserDocumentRepository from "../../../infrastructure/user-document/user-document.repository";
import DocumentEditor from "./document-editor";

const documentRepo = container.resolve(UserDocumentRepository);

export default async function DocumentPage(request: { params: { id: string } }) {
  const docId = request.params.id;
  const doc = await documentRepo.getById(docId);
  if (!doc) redirect("/not-found");
  const mdCode = await doc.getMdCode();
  return (
    <div className="">
      <DocumentEditor mdCode={mdCode} pdfFilePath={doc.getPublicPdfPath()} documentId={doc.getId()} />
    </div>
  );
}
