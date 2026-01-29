import Joi from "joi";

export const createDmeSchema = {
    body: Joi.object({
        company: Joi.string().required(),
        products: Joi.object({
            title: Joi.string().required(),
            isLink: Joi.boolean().optional(),
            link: Joi.string().optional()
        }).required(),
        insurances: Joi.object({
            title: Joi.string().required(),
            isLink: Joi.boolean().optional(),
            link: Joi.string().optional()
        }).required()
    })
}

export const updateDmeSchema = {
    body: Joi.object({
        id: Joi.string().required(),
        company: Joi.string().optional(),
        products: Joi.object({
            title: Joi.string().optional(),
            isLink: Joi.boolean().optional(),
            link: Joi.string().optional()
        }).optional(),
        insurances: Joi.object({
            title: Joi.string().optional(),
            isLink: Joi.boolean().optional(),
            link: Joi.string().optional()
        }).optional()
    })
}
export const getAllDmeSchema = {
    query: Joi.object({
        search: Joi.string().optional(),
        company: Joi.string().optional()
    })
}

export const deleteDmeSchema = {
    params: Joi.object({
        id: Joi.string().required()
    })
}