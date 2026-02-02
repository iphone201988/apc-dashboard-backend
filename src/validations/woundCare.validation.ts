import Joi from "joi";

export const createWoundCareSchema = {
    body: Joi.object({
        insurance: Joi.string()
            .trim()
            .required(),

        provider: Joi.string()
            .trim()
            .required()
    })
};

export const getAllWoundCareSchema = {
    body: Joi.object({
        search: Joi.string()
            .trim()
            .allow("")
            .optional()
    })
};

export const updateWoundCareSchema = {
    body: Joi.object({
        id: Joi.string()
            .required(),

        insurance: Joi.string()
            .trim()
            .optional(),

        provider: Joi.string()
            .trim()
            .optional()
    })
};


export const deleteWoundCareSchema = {
    body: Joi.object({
        id: Joi.string()
            .required()
    })
};
