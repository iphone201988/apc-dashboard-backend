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

    let filter: any = {};
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      };
    }

    const categories = await FavouriteCategoryModel.find(filter).lean();

    const categoriesWithItems = await Promise.all(
      categories.map(async (category) => {
        const items =
          await FavouriteItemModel.find({ categoryId: category._id }) || [];

        return {
          ...category,
          items
        };
      })
    );

    return SUCCESS(
      res,
      200,
      "Successfully fetched favourite categories",
      { categories: categoriesWithItems }
    );
  } catch (err) {
    next(err);
  }
};

export const createFavouriteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {  categoryId, title, link, description } = req.body;
        const icon = req.file?`uploads/${req.file?.filename}`: null;
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
        if (icon) item.icon = icon;

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