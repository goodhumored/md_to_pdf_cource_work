import UserDocument from "../../../domain/user-document/user-document";
import MinioService from "../../../infrastructure/minio.service";

export type UserDocumentDTO = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string;
  title_id: string | undefined;
  template_id: string | undefined;
  md_code: string | undefined;
  pdf_url: string;
};

export function mapUserDocumentToOutputDto(doc: UserDocument): UserDocumentDTO {
  return {
    name: doc.getName(),
    id: doc.getId(),
    updatedAt: doc.getUpdatedAt(),
    createdAt: doc.getCreatedAt(),
    thumbnail: MinioService.getPublicLink(doc.getThumbnailPath()),
    title_id: doc.getTitlePage()?.getId(),
    template_id: doc.getLatexTemplate()?.getId(),
    md_code: doc.getMdCode(),
    pdf_url: MinioService.getPublicLink(doc.getPdfPath()),
  };
}
