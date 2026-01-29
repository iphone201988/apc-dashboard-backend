import Joi from "joi";

export const createFavouriteCategoryScehma = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional()
    })
}

export const getAllFavouriteCategoriesSchema = {
    query: Joi.object({
        search: Joi.string().optional()
    })
}

export const createFavouriteItemSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        link: Joi.string().required(),
        description: Joi.string().required(),
        categoryId: Joi.string().required(),
        icon: Joi.string().optional()
    })

}
export const getAllFavouriteItemsSchema = {
    query: Joi.object({
        search: Joi.string().optional()
    })
}
export const deleteFavouriteItemSchema = {
    body: Joi.object({
        id: Joi.string().required()
    })
}

export const updateFavouriteItemSchema = {
    body: Joi.object({
        id: Joi.string().required(),
        title: Joi.string().optional(),
        link: Joi.string().optional(),
        description: Joi.string().optional(),
        categoryId: Joi.string().optional(),
        icon: Joi.string().optional()
    })
}

