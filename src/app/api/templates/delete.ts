"use server";

import { container } from "tsyringe";
import TemplateService from "../../../domain/latex-template/template.service";
import UserService from "../../../domain/user/user.service";
const templateService = container.resolve(TemplateService);
const userService = container.resolve(UserService);

export default async function DeleteTemlpate(id: string) {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  await templateService.delete(user.getId()!, id);
}
