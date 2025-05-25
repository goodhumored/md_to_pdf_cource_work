import "reflect-metadata";

import container from "@/container";
import { NextResponse } from "next/server";
import UserService from "../../../domain/user/user.service";
import TitlePageRepository from "../../../infrastructure/title-page/title-page.repository";

const titlePageRepository = container.resolve(TitlePageRepository);
const userService = container.resolve(UserService);

export async function GET() {
  await userService.getCurrentUserOrRedirectToAuth();
  const titlePages = await titlePageRepository.findAll();
  return NextResponse.json(
    titlePages.map((tp) => ({ name: tp.getName(), id: tp.getId() })),
  );
}
