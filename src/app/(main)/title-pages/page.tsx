import "reflect-metadata";
import { container } from "tsyringe";
import TitlePageRepository from "../../infrastructure/title-page/title-page.repository";
import CreateDocumentButton from "./create-title-page-button";
import TitlePageList from "./title-page-list";

const titlesRepo = container.resolve(TitlePageRepository);

export default async function Templates() {
  const titles = await titlesRepo.findAll();
  return (
    <div className="container py-8">
      <TitlePageList titles={titles} />
      <CreateDocumentButton className="mt-6 mx-auto" />
    </div>
  );
}
