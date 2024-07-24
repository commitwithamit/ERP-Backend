import express from "express";
import "dotenv/config";

import { deptRoutes, authRoutes, roleRoutes, permissionRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/handleErrors.js";

const app = express();

// used for parsing request bodies
// it converts the data coming in the form of json fills the body 
app.use(express.json());


app.use("/api/dept", deptRoutes);
app.use("/api/auth", authRoutes); // users
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);

// express default error handler..it should always be at the end of middleware stack otherwise it will give an error
app.use(errorHandler);
export default app;