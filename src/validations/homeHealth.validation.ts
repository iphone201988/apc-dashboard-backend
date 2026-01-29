import Joi from "joi"

export const createHomeHealthSchema={
    body:Joi.object({
        insurance:Joi.string().required(),
        agency:Joi.string().required()
    })
}

export const updateHomeHealthSchema={
    body:Joi.object({
        id:Joi.string().required(),
        insurance:Joi.string().optional(),
        agency:Joi.string().optional()
    })
}   
export const getAllHomeHealthSchema={
    query:Joi.object({
        search:Joi.string().optional(),
        agency:Joi.string().optional(),
        insurance:Joi.string().optional()
    })
}

export const deleteHomeHealthSchema={
    params:Joi.object({
        id:Joi.string().required()
    })
}