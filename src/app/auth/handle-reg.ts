"use server";

import { container } from "tsyringe";
import UserService from "../../domain/user/user.service";
import authSchema from "./auth.schema";

export type RegResult = { message: string; ok: boolean };

const userService = container.resolve(UserService);

export default async function handleReg(_: RegResult, formData: FormData): Promise<RegResult> {
  const username = formData.get("username");
  const password = formData.get("password");
  const res = authSchema.validate({ username, password });
  if (res.error) return { message: res.error.message, ok: false };

  await userService.register(res.value.username, res.value.password);
  return { message: "Регистрация успешна", ok: true };
}
