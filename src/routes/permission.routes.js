import { Router } from "express";
import { catchAsync } from "../middleware/index.js";
import { addPermission } from "../controllers/index.js";

export const permissionRoutes = Router();

permissionRoutes.post("/add-permission", catchAsync(addPermission));
