/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import container from "@/container";
import UserService from "../../../domain/user/user.service";
import authSchema from "./auth.schema";

export type RegResult = { message: string; ok: boolean };

const userService = container.resolve(UserService);

export default async function handleReg(
  _: RegResult,
  formData: FormData,
): Promise<RegResult> {
  const username = formData.get("username");
  const password = formData.get("password");
  const res = authSchema.validate({ username, password });
  if (res.error) return { message: res.error.message, ok: false };

  try {
    await userService.createUser(res.value.username, res.value.password);
  } catch (error: any) {
    console.error(`Ошибка при регистрации пользователя:`, error);
    return { message: error.message, ok: false };
  }
  return { message: "Регистрация успешна", ok: true };
}
