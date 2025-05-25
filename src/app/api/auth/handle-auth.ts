"use server";

import container from "@/container";
import UserService from "../../../domain/user/user.service";
import authSchema from "./auth.schema";

export type AuthResult = { message: string; ok: boolean };

const userService = container.resolve(UserService);

export default async function handleAuth(
  _: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const username = formData.get("username");
  const password = formData.get("password");
  const res = authSchema.validate({ username, password });
  if (res.error) return { message: res.error.message, ok: false };
  const data = res.value;
  if (await userService.auth(data.username, data.password)) {
    return { message: "Авторизация успешна", ok: true };
  }
  return { message: "Пользователь не найден", ok: false };
}
