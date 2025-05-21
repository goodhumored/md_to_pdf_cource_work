import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import "reflect-metadata";
import { container } from "tsyringe";
import SessionManager from "../session/session-manager";
import AuthForm from "./auth-form";

const sessionManager = container.resolve(SessionManager);

export default async function SignIn(request: NextRequest) {
  const session = await sessionManager.getSession(request);
  if (session?.getUser()) redirect("/");
  return (
    <div className="container flex flex-col items-center pt-20">
      <h1 className="text-center font-semibold text-3xl">Войдите в свой аккаунт</h1>
      <h2 className="text-black/80 text-center font-semibold text-xl mt-5">Добро пожаловать! Пожалуйста введите данные авторизации в форму ниже</h2>
      <AuthForm />
    </div>
  );
}
