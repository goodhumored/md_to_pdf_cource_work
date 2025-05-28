import "reflect-metadata";

import container from "@/container";
import { NextResponse } from "next/server";
import UserDocumentService from "../../../domain/user-document/user-document.service";
import { mapUserDocumentToOutputDto } from "./user-document.dto";

const userDocumentService = container.resolve(UserDocumentService);

export async function GET() {
  const documents = await userDocumentService.getUserDocuments();
  return NextResponse.json(documents.map(mapUserDocumentToOutputDto));
}
