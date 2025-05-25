"use server";

import container from "@/container";
import { redirect } from "next/navigation";
import "reflect-metadata";
import SessionManager from "../../../domain/session/session-manager";

const sessionManager = container.resolve(SessionManager);

export default async function handleLogout() {
  await sessionManager.logoutSession();
  redirect("/signin");
}
