import joi from 'joi'

export const videoValidate = data => {
    const videoSchema = joi.object({
        title: joi.string(),
        poster: joi.string(),
        view: joi.number(),
        description: joi.string(),
        active: joi.boolean()
    }).unknown(true);
    return videoSchema.validate(data)
}
