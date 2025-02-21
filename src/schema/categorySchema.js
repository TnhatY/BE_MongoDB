import Joi from "joi";

export const categoryValidate = data => {
    const categorySchema = Joi.object({
        categoryName: Joi.string().required(),
        categoryCode: Joi.string()

    }).unknown(true)
    return categorySchema.validate(data)
}