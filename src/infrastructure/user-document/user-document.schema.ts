type UserDocumentSchema = {
  id: string;
  owner_id: number;
  name: string;
  pdf_file_name: string;
  md_file_name: string;
  created_at: Date;
  updated_at: Date;
};
export default UserDocumentSchema;
