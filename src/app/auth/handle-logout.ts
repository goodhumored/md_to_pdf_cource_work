"use server";

import { redirect } from "next/navigation";
import "reflect-metadata";
import { container } from "tsyringe";
import SessionManager from "../session/session-manager";

const sessionManager = container.resolve(SessionManager);

export default async function handleLogout() {
  await sessionManager.logoutSession();
  redirect("/signin");
}
