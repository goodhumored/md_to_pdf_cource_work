import Joi from "joi";

const createDocumentSchema = Joi.object<{ name: string }>({
  name: Joi.string()
    .regex(/[а-яА-Я0-9\Sa-zA-Z]/)
    .min(3)
    .max(100)
    .required()
});
export default createDocumentSchema;
