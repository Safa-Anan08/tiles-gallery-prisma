import { Router } from "express";
import {
  getAllCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller";
import { validateRequest } from "../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";
import { authenticateJwt, requireRole } from "../middleware/auth";
import { UserRole } from "../types/auth";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

// Protected Management Endpoints
router.post(
  "/",
  authenticateJwt,
  requireRole(UserRole.ADMIN),
  validateRequest(createCategorySchema),
  createCategoryController
);
router.put(
  "/:id",
  authenticateJwt,
  requireRole(UserRole.ADMIN),
  validateRequest(updateCategorySchema),
  updateCategoryController
);
router.delete(
  "/:id",
  authenticateJwt,
  requireRole(UserRole.ADMIN),
  deleteCategoryController
);

export default router;
