import { Router } from "express";
import { createMessageController } from "../controllers/contact.controller";

const router = Router();

router.post("/", createMessageController);

export default router;
