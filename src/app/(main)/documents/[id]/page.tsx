import { redirect } from "next/navigation";
import "reflect-metadata";
import container from "@/container";
import LatexTemplateRepository from "../../../../infrastructure/latex-template/latex-template.repository";
import TitlePageRepository from "../../../../infrastructure/title-page/title-page.repository";
import UserDocumentRepository from "../../../../infrastructure/user-document/user-document.repository";
import DocumentEditor from "./document-editor";

const documentRepo = container.resolve(UserDocumentRepository);
const titleRepo = container.resolve(TitlePageRepository);
const templateRepo = container.resolve(LatexTemplateRepository);

export default async function DocumentPage(request: { params: Promise<{ id: string }> }) {
  const docId = (await request.params).id;
  const doc = await documentRepo.getById(docId);
  if (!doc) redirect("/not-found");
  const mdCode = await doc.getMdCode();
  const titles = await titleRepo.findAll();
  const templates = await templateRepo.findAll();
  return (
    <div className="">
      <DocumentEditor
        mdCode={mdCode}
        pdfFilePath={doc.getPublicPdfPath()}
        documentId={doc.getId()}
        titles={titles.map((t) => ({ id: t.getId(), name: t.getName() }))}
        templates={templates.map((t) => ({ id: t.getId(), name: t.getName() }))}
        pickedTemplate={doc.getLatexTemplate()?.getId()}
        pickedTitle={doc.getTitlePage()?.getId()}
      />
    </div>
  );
}
