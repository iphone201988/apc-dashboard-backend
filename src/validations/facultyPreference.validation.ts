import Joi from "joi";

export const createFacultyPreferencesSchema = {
    body: Joi.object({
        faculty: Joi.string()
            .trim()
            .required(),

        pharmacy: Joi.string()
            .trim()
            .required(),

        homeHealth: Joi.string()
            .trim()
            .required(),

        hospice: Joi.string()
            .trim()
            .required()
    })
};

export const getAllFacultyPreferencesSchema = {
    query: Joi.object({
        search: Joi.string()
            .trim()
            .allow("")
            .optional()
    })
};

export const updateFacultyPreferencesSchema = {
    body: Joi.object({
        id: Joi.string()
            .required(),

        faculty: Joi.string()
            .trim()
            .optional(),

        pharmacy: Joi.string()
            .trim()
            .optional(),

        homeHealth: Joi.string()
            .trim()
            .optional(),

        hospice: Joi.string()
            .trim()
            .optional()
    })
};

export const deleteFacultyPreferencesSchema = {
    params: Joi.object({
        id: Joi.string()
            .required()
    })
};
