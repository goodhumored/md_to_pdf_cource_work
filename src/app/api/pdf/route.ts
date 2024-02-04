import { NextRequest } from "next/server";
import MDToPDFConverter from "../../../domain/md-to-pdf-converter";

export type RenderPdfApiResponse = { fileName: string };

export async function POST(request: NextRequest): Promise<Response> {
  if (!request.body) return new Response("", { status: 400 });

  const md = await request.text();
  const response = await MDToPDFConverter.convert(md, "public/Nekrasov4142.pdf");
  return Response.json({ fileName: "Nekrasov4142.pdf" });
}
