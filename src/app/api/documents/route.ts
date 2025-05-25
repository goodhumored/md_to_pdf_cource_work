import "reflect-metadata";

import container from "@/container";
import { NextResponse } from "next/server";
import UserDocumentService from "../../../domain/user-document/user-document.service";

const userDocumentService = container.resolve(UserDocumentService);

export async function GET() {
  const documents = await userDocumentService.getUserDocuments();
  return NextResponse.json(
    documents.map((doc) => ({
      name: doc.getName(),
      id: doc.getId(),
      updatedAt: doc.getUpdatedAt(),
      createdAt: doc.getCreatedAt(),
      thumbnail: doc.getCoverUrl(),
    })),
  );
}
