import UserDocument from "../../domain/user-document/user-document";
import DocumentItem from "./document-item";

export default function DocumentsList({ className, documents }: { className?: string; documents: UserDocument[] }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {documents.map((doc, i) => (
        <DocumentItem key={i} document={doc} />
      ))}
    </div>
  );
}
