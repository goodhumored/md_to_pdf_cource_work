import "reflect-metadata";

import container from "@/container";
import { NextResponse } from "next/server";
import TemplateService from "../../../domain/latex-template/template.service";
import UserService from "../../../domain/user/user.service";
import MinioService from "../../../infrastructure/minio.service";

const templateService = container.resolve(TemplateService);
const userService = container.resolve(UserService);

export type TemplateDTO = {
  name: string;
  id: string;
  thumbnail: string;
};

export async function GET() {
  const user = await userService.getCurrentUserOrRedirectToAuth();
  const templates = await templateService.getUserTemplates(user.getId()!);
  return NextResponse.json(
    templates.map((tp) => ({
      name: tp.getName(),
      id: tp.getId(),
      thumbnail: MinioService.getPublicLink(tp.getThumbnail()),
    })),
  );
}
