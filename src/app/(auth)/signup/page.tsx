import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import "reflect-metadata";
import container from "@/container";
import RegistrationForm from "./reg-form";
import SessionManager from "../../../domain/session/session-manager";

const sessionManager = container.resolve(SessionManager);

export default async function SignUp(request: NextRequest) {
  const session = await sessionManager.getSession(request);
  if (session?.getUser()) redirect("/dashboard");
  return (
    <div className="container flex flex-col items-center pt-20">
      <h1 className="text-center font-semibold text-4xl">Регистрация</h1>
      <h2 className="text-black/80 text-center font-semibold text-xl mt-5">Добро пожаловать! Пожалуйста заполните форму ниже для доступа к функционалу сайта!</h2>
      <RegistrationForm />
    </div>
  );
}
