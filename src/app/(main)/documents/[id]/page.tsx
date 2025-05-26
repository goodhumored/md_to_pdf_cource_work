import { redirect } from "next/navigation";
import "reflect-metadata";
import container from "@/container";
import LatexTemplateRepository from "../../../../infrastructure/latex-template/latex-template.repository";
import TitlePageRepository from "../../../../infrastructure/title-page/title-page.repository";
import DocumentEditor from "./document-editor";
import UserDocumentService from "../../../../domain/user-document/user-document.service";
import MinioService from "../../../../infrastructure/minio.service";

const documentService = container.resolve(UserDocumentService);
const titleRepo = container.resolve(TitlePageRepository);
const templateRepo = container.resolve(LatexTemplateRepository);

export default async function DocumentPage(request: { params: Promise<{ id: string }> }) {
  const docId = (await request.params).id;
  const doc = await documentService.getUserDocument(docId);
  if (!doc) redirect("/not-found");
  const mdCode = doc.getMdCode();
  const titles = await titleRepo.findAll();
  const templates = await templateRepo.findAll();
  return (
    <div className="">
      <DocumentEditor
        mdCode={mdCode}
        pdfFilePath={MinioService.getPublicLink(doc.getPdfPath() ?? "")}
        documentId={doc.getId()}
        titles={titles.map((t) => ({ id: t.getId(), name: t.getName() }))}
        templates={templates.map((t) => ({ id: t.getId(), name: t.getName() }))}
        pickedTemplate={doc.getLatexTemplate()?.getId()}
        pickedTitle={doc.getTitlePage()?.getId()}
      />
    </div>
  );
}
