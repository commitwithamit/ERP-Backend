import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import { deptRoutes,
    authRoutes,
    roleRoutes,
    permissionRoutes,
    userRoutes
} from "./routes/index.js";
import { errorHandler } from "./middleware/handleErrors.js";
import corsOptions from "./config/cors.options.js";

const app = express();

// used for parsing request bodies
// it converts the data coming in the form of json fills the body 
app.use(express.json());
app.use(cors(corsOptions));
// used for parsing cookies (to get cookies)
app.use(cookieParser());

// other way of setting CORS policy without using cors package
// app.use((req, res, next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     next();
// });


app.use("/api/dept", deptRoutes);
app.use("/api/auth", authRoutes); // users
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/user", userRoutes);

// express default error handler..it should always be at the end of middleware stack otherwise it will give an error
app.use(errorHandler);
export default app; 