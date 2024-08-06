import {Router} from "express";
import { createDept, getDept, deleteDept, updateDept } from "../controllers/index.js";
import { catchAsync, verifyJWT } from "../middleware/index.js";
export const deptRoutes = Router();

deptRoutes.post("/create-dept", verifyJWT, catchAsync(createDept));

deptRoutes.get("/get-depts", catchAsync(getDept));

deptRoutes.delete("/delete-dept/:id", catchAsync(deleteDept));

deptRoutes.put("/update-dept/:id", catchAsync(updateDept));

// .get .post are called routehandlers