import "reflect-metadata";
import DocumentsList from "./documents-list";

export default async function Documents() {
  return (
    <div className="container py-8">
      <DocumentsList />
    </div>
  );
}
