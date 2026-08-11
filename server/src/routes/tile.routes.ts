import { Router } from "express";
import {
  getAllTilesController,
  getTileByIdController,
  createTileController,
  updateTileController,
  deleteTileController,
} from "../controllers/tile.controller";
import { validateRequest } from "../middleware/validate";
import { createTileSchema, updateTileSchema } from "../schemas/tile.schema";
import { authenticateJwt, requireRole } from "../middleware/auth";
import { UserRole } from "../types/auth";

const router = Router();

// Public Read Endpoints
router.get("/", getAllTilesController);
router.get("/:id", getTileByIdController);

// Protected Management Endpoints (Admin Only)
router.post(
  "/",
  authenticateJwt,
  requireRole(UserRole.ADMIN),
  validateRequest(createTileSchema),
  createTileController
);
router.put(
  "/:id",
  authenticateJwt,
  requireRole(UserRole.ADMIN),
  validateRequest(updateTileSchema),
  updateTileController
);
router.delete(
  "/:id",
  authenticateJwt,
  requireRole(UserRole.ADMIN),
  deleteTileController
);

export default router;
