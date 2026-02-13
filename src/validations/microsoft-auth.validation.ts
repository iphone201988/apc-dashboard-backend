import Joi from "joi";

export const microsoftLoginSchema = {
    body: Joi.object({
        accessToken: Joi.string().required().messages({
            "string.empty": "Access token is required",
            "any.required": "Access token is required",
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email",
            "any.required": "Email is required",
        }),
        firstName: Joi.string().optional().allow(""),
        lastName: Joi.string().optional().allow(""),
        microsoftId: Joi.string().required().messages({
            "string.empty": "Microsoft ID is required",
            "any.required": "Microsoft ID is required",
        }),
    }),
};

export const verifyTokenSchema = {
    body: Joi.object({
        accessToken: Joi.string().required().messages({
            "string.empty": "Access token is required",
            "any.required": "Access token is required",
        }),
    }),
};
