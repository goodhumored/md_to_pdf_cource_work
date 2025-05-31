import "reflect-metadata"

import { container } from "tsyringe";
import UserService from "../domain/user/user.service";
import { redirect } from "next/navigation";

const userService = container.resolve(UserService)

export default async function Home() {
  await userService.getCurrentUserOrRedirectToAuth();
  redirect("/dashboard");
}
