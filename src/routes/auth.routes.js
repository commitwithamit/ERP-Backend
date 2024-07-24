import { Router } from "express";
import { catchAsync } from "../middleware/index.js";
import { login} from "../controllers/index.js";

export const authRoutes = Router();

// authRoutes.post("/register", catchAsync(resisterUser));
authRoutes.post("/login", catchAsync(login));