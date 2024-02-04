type SessionSchema = {
  id: string | null;
  user_id: number | null;
  last_used: Date;
  created_at: Date;
};
export default SessionSchema;
