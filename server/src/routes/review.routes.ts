import { Router } from "express";
import {
  getReviewsByTileController,
  getReviewByIdController,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/review.controller";
import { authenticateJwt } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { createReviewSchema, updateReviewSchema } from "../schemas/review.schema";

const router = Router();

router.get("/", getReviewsByTileController);
router.get("/:id", getReviewByIdController);

// Protected Operations (Requires JWT)
router.post(
  "/",
  authenticateJwt,
  validateRequest(createReviewSchema),
  createReviewController
);
router.put(
  "/:id",
  authenticateJwt,
  validateRequest(updateReviewSchema),
  updateReviewController
);
router.delete("/:id", authenticateJwt, deleteReviewController);

export default router;
