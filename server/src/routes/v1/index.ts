import { Router } from "express";
import healthRouter from "../health.routes";
import authRouter from "../auth.routes";
import tileRouter from "../tile.routes";
import categoryRouter from "../category.routes";
import reviewRouter from "../review.routes";
import cartRouter from "../cart.routes";
import wishlistRouter from "../wishlist.routes";
import userRouter from "../user.routes";
import contactRouter from "../contact.routes";

const router = Router();

// Version 1 (/api/v1) Route Aggregator
router.use("/", healthRouter);
router.use("/auth", authRouter);
router.use("/tiles", tileRouter);
router.use("/categories", categoryRouter);
router.use("/reviews", reviewRouter);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/user", userRouter);
router.use("/users", userRouter);
router.use("/contact-us", contactRouter);

export default router;
