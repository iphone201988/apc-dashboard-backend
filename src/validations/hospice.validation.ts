import Joi from "joi"

export const createHospiceSchema={
    body:Joi.object({
        title:Joi.string().required(),
        choice:Joi.string().required()
    })
}

export const updateHospiceSchema={
    body:Joi.object({
        id:Joi.string().required(),
        title:Joi.string().optional(),
        choice:Joi.string().optional()
    })
}   
export const getAllHospiceSchema={
    query:Joi.object({
        search:Joi.string().optional(),
    })
}

export const deleteHospiceSchema={
    params:Joi.object({
        id:Joi.string().required()
    })
}
