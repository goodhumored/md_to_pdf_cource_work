import "reflect-metadata";

import container from "@/container";
import { NextResponse } from "next/server";
import TitlePageService from "../../../domain/title-page/titl-page.service";
import UserService from "../../../domain/user/user.service";
import MinioService from "../../../infrastructure/minio.service";

const titlePageService = container.resolve(TitlePageService);
const userService = container.resolve(UserService);

export type TitlePageDTO = {
  name: string;
  id: string;
  thumbnail: string;
};

export async function GET() {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  const titlePages = await titlePageService.getUserTitlePages(user.getId()!);
  return NextResponse.json(
    titlePages.map((tp) => ({
      name: tp.getName(),
      id: tp.getId(),
      thumbnail: MinioService.getPublicLink(tp.getThumbnail()),
    })),
  );
}
