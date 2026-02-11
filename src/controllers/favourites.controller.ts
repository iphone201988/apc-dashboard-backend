import { NextFunction, Request, Response } from "express";
import FavouriteCategoryModel from "../models/favouriteCategory.model";
import { SUCCESS } from "../utils/helpers";
import FavouriteItemModel from "../models/favouriteItems.model";


export const createFavouriteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const categopryExists = await FavouriteCategoryModel.findOne({ title });
        if (categopryExists) {
            return res.status(400).json({
                message: "Cateogry already Exists",
                success: false
            })
        }
        const newCategory = FavouriteCategoryModel.create({
            title,
            description
        })
        return SUCCESS(res, 201, "Successfully created favourite category", newCategory)
    } catch (err) {
        next(err)
    }
}
export const getAllFavouriteCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const search = req.query.search as string;

        let categoryIds: any[] = [];
        let categoryFilter: any = {};

        if (search) {
            // Search in items (title and description)
            const matchingItems = await FavouriteItemModel.find({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            }).select('categoryId').lean();

            // Get unique category IDs from matching items
            const itemCategoryIds = [...new Set(matchingItems.map(item => item.categoryId.toString()))];

            // Search in categories (title and description)
            const matchingCategories = await FavouriteCategoryModel.find({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            }).select('_id').lean();

            const categoryCategoryIds = matchingCategories.map(cat => cat._id.toString());

            // Combine both sets of category IDs
            categoryIds = [...new Set([...itemCategoryIds, ...categoryCategoryIds])];

            // Filter to only include categories that match
            if (categoryIds.length > 0) {
                categoryFilter = { _id: { $in: categoryIds } };
            } else {
                // No matches found, return empty
                return SUCCESS(
                    res,
                    200,
                    "Successfully fetched favourite categories",
                    { categories: [] }
                );
            }
        }

        const categories = await FavouriteCategoryModel.find(categoryFilter).lean();

        const categoriesWithItems = await Promise.all(
            categories.map(async (category) => {
                let itemFilter: any = { categoryId: category._id };

                // If searching, filter items to only show matching ones
                if (search) {
                    itemFilter = {
                        categoryId: category._id,
                        $or: [
                            { title: { $regex: search, $options: "i" } },
                            { description: { $regex: search, $options: "i" } }
                        ]
                    };
                }

                const items = await FavouriteItemModel.find(itemFilter) || [];

                return {
                    ...category,
                    items
                };
            })
        );

        // Filter out categories with no items when searching
        const filteredCategories = search
            ? categoriesWithItems.filter(cat => cat.items.length > 0)
            : categoriesWithItems;

        return SUCCESS(
            res,
            200,
            "Successfully fetched favourite categories",
            { categories: filteredCategories }
        );
    } catch (err) {
        next(err);
    }
};

export const createFavouriteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId, title, link, description } = req.body;
        const icon = req.file ? `uploads/${req.file?.filename}` : null;
        const category = await FavouriteCategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            })
        }
        const newItem = await FavouriteItemModel.create({
            categoryId,
            title,
            link,
            description,
            icon
        })
        return SUCCESS(res, 201, "Successfully created favourite item", newItem)
    } catch (err) {
        next(err)
    }
}

export const getAllFavouriteItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search = req.query.search;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            }
        }
        const items = await FavouriteItemModel.find(filter).populate('categoryId');
        return SUCCESS(res, 200, "Successfully fetched favourite items", { items })
    }
    catch (err) {
        next(err)
    }

}

export const deleteFavouriteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;
        const item = await FavouriteItemModel.findByIdAndDelete(id)
        if (!item) {
            return res.status(404).json({
                message: "Item not found",
                success: false
            })
        }
        return SUCCESS(res, 200, "Successfully deleted favourite item", item)
    } catch (err) {
        next(err)
    }
}

export const updateFavouriteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, icon, categoryId, title, link, description } = req.body;
        const item = await FavouriteItemModel.findById(id);
        if (!item) {
            return res.status(404).json({
                message: "Item not found",
                success: false
            })
        }
        if (categoryId) {
            const category = await FavouriteCategoryModel.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    message: "Category not found",
                    success: false
                })
            }
            item.categoryId = categoryId;
        }
        if (title) item.title = title;
        if (link) item.link = link;
        if (description) item.description = description;

        const iconPath = req.file ? `uploads/${req.file.filename}` : null;
        if (iconPath) item.icon = iconPath;
        // Keep existing icon if no new file is uploaded, effectively ignoring req.body.icon if we want to enforce file upload for updates or we handle mixed logic. 
        // But to be consistent with creating item, we prefer file upload. 
        // If req.body.icon is sent (e.g. as string), we might want to allow it depending on use case, but usually file upload overrides.

        await item.save();
        return SUCCESS(res, 200, "Successfully updated favourite item", item)
    } catch (err) {
        next(err)
    }
}

export default {
    getAllFavouriteCategories,
    createFavouriteCategory,
    createFavouriteItem,
    getAllFavouriteItems,
    deleteFavouriteItem,
    updateFavouriteItem
}