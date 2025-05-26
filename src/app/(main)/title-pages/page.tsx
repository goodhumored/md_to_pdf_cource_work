import "reflect-metadata";
import { container } from "tsyringe";
import TitlePageList from "./title-page-list";
import TitlePageService from "../../../domain/title-page/titl-page.service";
import UserService from "../../../domain/user/user.service";

const titlesService = container.resolve(TitlePageService);
const userService = container.resolve(UserService);

export default async function Templates() {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  const titles = await titlesService.getUserTitlePages(user.getId()!);
  return (
    <div className="container py-8">
      <TitlePageList titles={titles} />
    </div>
  );
}
