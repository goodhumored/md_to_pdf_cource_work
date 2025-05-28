import Joi from "joi";

const updateDocumentSchema = Joi.object<{ name: string; id: string }>({
  name: Joi.string()
    .regex(/[а-яА-Я0-9\Sa-zA-Z]/)
    .min(3)
    .max(100),
  id: Joi.string().uuid({ version: "uuidv4" }).required(),
});
export default updateDocumentSchema;
