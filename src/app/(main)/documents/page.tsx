import "reflect-metadata";
import DocumentsList from "./documents-list";

export default function Documents() {
  return (
    <div className="container pt-20">
      <h1 className="container font-medium text-4xl">Ваши документы:</h1>
      <DocumentsList className="mt-12" />
    </div>
  );
}
