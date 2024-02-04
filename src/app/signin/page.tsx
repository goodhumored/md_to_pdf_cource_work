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
    <div className="container flex flex-col items-center">
      <AuthForm />
    </div>
  );
}
