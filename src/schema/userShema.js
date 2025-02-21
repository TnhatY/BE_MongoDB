import joi from 'joi'

export const userValidate = data => {
    const userSchema = joi.object({
        email: joi.string().required().email()
    }).unknown(true);
    return userSchema.validate(data)
}


