import {Router} from "express";
import { createDept, getDept, deleteDept, updateDept } from "../controllers/index.js";
import { catchAsync, verifyJWT } from "../middleware/index.js";

export const deptRoutes = Router();

deptRoutes.post("/create-dept", verifyJWT, catchAsync(createDept));

deptRoutes.get("/get-depts", verifyJWT, catchAsync(getDept));

deptRoutes.delete("/delete-dept/:id", verifyJWT, catchAsync(deleteDept));

deptRoutes.put("/update-dept/:id", verifyJWT, catchAsync(updateDept));

// .get .post are called routehandlers