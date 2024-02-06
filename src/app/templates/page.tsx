import "reflect-metadata";
import { container } from "tsyringe";
import LatexTemplateRepository from "../../infrastructure/latex-template/latex-template.repository";
import CreateDocumentButton from "./create-templates-button";
import TemplatesList from "./templates-list";

const templatesRepo = container.resolve(LatexTemplateRepository);

export default async function Templates() {
  const templates = await templatesRepo.findAll();
  return (
    <div className="container py-8">
      <TemplatesList templates={templates} />
      <CreateDocumentButton className="mt-6 mx-auto" />
    </div>
  );
}
