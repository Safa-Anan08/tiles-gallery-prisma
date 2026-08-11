import { Router } from "express";
import {
  registerController,
  loginController,
  meController,
  logoutController,
} from "../controllers/auth.controller";
import { authenticateJwt } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerController);
router.post("/login", validateRequest(loginSchema), loginController);
router.get("/me", authenticateJwt, meController);
router.post("/logout", logoutController);

export default router;
