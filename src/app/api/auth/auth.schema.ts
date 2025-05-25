import Joi from "joi";

const authSchema = Joi.object<{ username: string; password: string }>({
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
});
export default authSchema;
