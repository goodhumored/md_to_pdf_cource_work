type UserDocumentSchema = {
  id: string;
  owner_id: number;
  name: string;
  pdf_file_name: string;
  md_file_name: string;
  template_id: string | null;
  title_page_id: string | null;
  created_at: Date;
  updated_at: Date;
};
export default UserDocumentSchema;
