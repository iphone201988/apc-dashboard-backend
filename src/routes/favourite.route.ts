import express from "express";
import validate from "../middleware/validate.middleware";
import authMiddleware from "../middleware/auth.middleware";
import { createFavouriteCategoryScehma, createFavouriteItemSchema, deleteFavouriteItemSchema, getAllFavouriteCategoriesSchema, getAllFavouriteItemsSchema, updateFavouriteItemSchema } from "../validations/favourites.validation";
import favouritesController from "../controllers/favourites.controller";
import { create } from "node:domain";
import { upload } from "../middleware/multer.middleware";

const favouriteRouter =express.Router();

favouriteRouter.post("/create-category",authMiddleware,validate(createFavouriteCategoryScehma),favouritesController.createFavouriteCategory);
favouriteRouter.get("/categories",authMiddleware,validate(getAllFavouriteCategoriesSchema),favouritesController.getAllFavouriteCategories);
favouriteRouter.post("/create-item",upload.single('image') ,  authMiddleware,validate(createFavouriteItemSchema),favouritesController.createFavouriteItem);
favouriteRouter.get("/items",authMiddleware,validate(getAllFavouriteItemsSchema),favouritesController.getAllFavouriteItems);
favouriteRouter.post("/delete-item",authMiddleware,validate(deleteFavouriteItemSchema),favouritesController.deleteFavouriteItem);
favouriteRouter.put("/update-item",authMiddleware,validate(updateFavouriteItemSchema),favouritesController.updateFavouriteItem);

export default favouriteRouter;