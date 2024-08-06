import { Router } from "express";
import { catchAsync } from "../middleware/index.js";
import { login, registerUser, getNewAccessToken, logout} from "../controllers/index.js";

export const authRoutes = Router();

authRoutes.post("/register", catchAsync(registerUser));

authRoutes.post("/login", catchAsync(login));

authRoutes.get("/refresh", catchAsync(getNewAccessToken));

authRoutes.post("/logout", catchAsync(logout));