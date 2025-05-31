type UserSchema = {
  id?: number | undefined;
  username: string;
  password_hash: string;
};
export default UserSchema;
