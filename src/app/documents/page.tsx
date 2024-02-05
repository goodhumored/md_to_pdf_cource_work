import { redirect } from "next/navigation";
import "reflect-metadata";
import { container } from "tsyringe";
import UserDocumentRepository from "../../infrastructure/user-document/user-document.repository";
import SessionManager from "../session/session-manager";
import CreateDocumentButton from "./create-document-button";
import DocumentsList from "./documents-list";

const sessionManager = container.resolve(SessionManager);
const userDocumentRepo = container.resolve(UserDocumentRepository);

export default async function Documents() {
  const session = await sessionManager.getSession();
  const userId = session?.getUser()?.getId();
  if (!userId) return redirect("/");
  const documents = await userDocumentRepo.getByOwnerId(userId);
  return (
    <div className="container py-8">
      <DocumentsList documents={documents} />
      <CreateDocumentButton className="mt-6 mx-auto" />
    </div>
  );
}
