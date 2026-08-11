import { Router } from "express";
import { getAllUsersController, updateUserProfileController } from "../controllers/user.controller";
import { authenticateJwt, requireRole } from "../middleware/auth";
import { UserRole } from "../types/auth";

const router = Router();

router.use(authenticateJwt);

router.get("/", requireRole(UserRole.ADMIN), getAllUsersController);
router.put("/update", updateUserProfileController);

export default router;
