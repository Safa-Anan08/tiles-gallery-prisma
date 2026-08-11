import { Router } from "express";
import {
  getWishlistController,
  addToWishlistController,
  deleteFromWishlistController,
} from "../controllers/wishlist.controller";
import { authenticateJwt } from "../middleware/auth";

const router = Router();

router.use(authenticateJwt);

router.get("/", getWishlistController);
router.post("/", addToWishlistController);
router.delete("/", deleteFromWishlistController);

export default router;
