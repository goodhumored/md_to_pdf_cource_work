"use server";

import { container } from "tsyringe";
import TitlePageService from "../../../domain/title-page/titl-page.service";
import UserService from "../../../domain/user/user.service";
const titlePageService = container.resolve(TitlePageService);
const userService = container.resolve(UserService);

export default async function DeleteTitlePage(id: string) {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  await titlePageService.delete(user.getId()!, id);
}
