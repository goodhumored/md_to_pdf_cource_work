import "reflect-metadata";

import container from "@/container";
import { NextResponse } from "next/server";
import { join } from "path/posix";
import config from "../../../config/config";
import TitlePageService from "../../../domain/title-page/titl-page.service";
import UserService from "../../../domain/user/user.service";

const titlePageService = container.resolve(TitlePageService);
const userService = container.resolve(UserService);

export async function GET() {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  const titlePages = await titlePageService.getUserTitlePages(user.getId()!);
  return NextResponse.json(
    titlePages.map((tp) => ({
      name: tp.getName(),
      id: tp.getId(),
      thumbnail: join(
        config.fileStorage.public_url,
        config.fileStorage.bucket_name,
        tp.getThumbnail() ?? "",
      ),
    })),
  );
}
