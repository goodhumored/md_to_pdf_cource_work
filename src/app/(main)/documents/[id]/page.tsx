import { redirect } from "next/navigation";
import "reflect-metadata";
import container from "@/container";
import DocumentEditor from "./document-editor";
import UserDocumentService from "../../../../domain/user-document/user-document.service";
import { mapUserDocumentToOutputDto } from "../../../api/documents/user-document.dto";

const documentService = container.resolve(UserDocumentService);

export default async function DocumentPage(request: { params: Promise<{ id: string }> }) {
  const docId = (await request.params).id;
  const doc = await documentService.getUserDocument(docId);
  if (!doc) redirect("/not-found");
  return (
    <div className="">
      <DocumentEditor doc={mapUserDocumentToOutputDto(doc)}
      />
    </div>
  );
}
