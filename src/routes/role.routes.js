import { Router } from "express";
import { catchAsync } from "../middleware/index.js";
import { createRole, getRoles } from "../controllers/index.js";

export const roleRoutes = Router();

roleRoutes.post("/create-role", catchAsync(createRole));

roleRoutes.get("/get-roles", catchAsync(getRoles));