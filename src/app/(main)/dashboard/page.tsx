import "reflect-metadata";
import { container } from "tsyringe";
import UserService from "../../../domain/user/user.service";
import DocumentsList from "../documents/documents-list";

const userService = container.resolve(UserService);

export default async function Dashboard() {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  return (
    <div className="pt-20">
      <h1 className="container font-medium text-4xl">Добро пожаловать, {user.getUsername()}!</h1>
      <section className="mt-12 bg-slate-100 py-10">
        <div className="container">
          <h2 className="font-medium text-2xl">Последние документы</h2>
          <DocumentsList />
        </div>
      </section>
    </div>
  );
}
