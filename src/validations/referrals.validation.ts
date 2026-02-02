import Joi from "joi";
import { speciality, type } from "../utils/enums";

export const createReferralSchema = {
    body: Joi.object({
        speciality: Joi.string()
            .valid(...Object.values(speciality))
            .required(),

        type: Joi.string()
            .valid(...Object.values(type))
            .required(),

        provider: Joi.string()
            .trim()
            .required(),

        company: Joi.string()
            .trim()
            .required(),

        comments: Joi.string()
            .trim()
            .allow("")
            .optional()
    })
};


export const getAllReferralsSchema = {
    query: Joi.object({
        search: Joi.string()
            .trim()
            .allow("")
            .optional(),

        speciality: Joi.string()
            .valid(...Object.values(speciality))
            .optional(),

        type: Joi.string()
            .valid(...Object.values(type))
            .optional()
    })
};

export const updateReferralSchema = {
    body: Joi.object({
        id: Joi.string()
            .required(),

        speciality: Joi.string()
            .valid(...Object.values(speciality))
            .optional(),

        type: Joi.string()
            .valid(...Object.values(type))
            .optional(),

        provider: Joi.string()
            .trim()
            .optional(),

        company: Joi.string()
            .trim()
            .optional(),

        comments: Joi.string()
            .trim()
            .allow("")
            .optional()
    })
};