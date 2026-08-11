import { Router } from "express";
import {
  getCartController,
  addToCartController,
  deleteFromCartController,
} from "../controllers/cart.controller";
import { authenticateJwt } from "../middleware/auth";

const router = Router();

router.use(authenticateJwt);

router.get("/", getCartController);
router.post("/", addToCartController);
router.delete("/", deleteFromCartController);

export default router;
