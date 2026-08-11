import { Router } from "express";
import {
  registerController,
  loginController,
  googleController,
  meController,
  logoutController,
} from "../controllers/auth.controller";
import { authenticateJwt } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { loginSchema, registerSchema, googleAuthSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerController);
router.post("/login", validateRequest(loginSchema), loginController);
router.post("/google", validateRequest(googleAuthSchema), googleController);
router.get("/me", authenticateJwt, meController);
router.post("/logout", logoutController);

export default router;

