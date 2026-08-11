import { Request, Response } from "express";
import { CategoryService } from "../services/category/categoryService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllCategoriesController = asyncHandler(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  return sendSuccessResponse(res, 200, "Categories retrieved successfully", categories);
});

export const getCategoryByIdController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await CategoryService.getCategoryById(id);
  return sendSuccessResponse(res, 200, "Category retrieved successfully", category);
});

export const createCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  return sendSuccessResponse(res, 201, "Category created successfully", category);
});

export const updateCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await CategoryService.updateCategory(id, req.body);
  return sendSuccessResponse(res, 200, "Category updated successfully", category);
});

export const deleteCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await CategoryService.deleteCategory(id);
  return sendSuccessResponse(res, 200, "Category deleted successfully", { success: true });
});
