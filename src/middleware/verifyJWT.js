import jwt from "jsonwebtoken";
import { CustomError } from "../utils/index.js";
import { User } from "../models/user.js";


export const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers?.authorization;
    
    if(!authHeader || !authHeader?.startsWith("Bearer ")){
        return next (new CustomError("You are not authenticated", 400));
    }
    
    const token = authHeader.split(" ")[1];

    let decodedToken;
    try{
        // wrapping decodedToken in try catch even though it's a sync because if token doesn't match or anything it will return an error which will crash our server so to prevent that we have to wrap it in decodedToken
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        console.log(decodedToken);
    }catch(err){
        return next(new CustomError("Session Expired", 403)); //forbidden
    }

    const user = await User.findById(decodedToken.userId);
    if(!user){
        return next (new CustomError("User not found", 401));
    }
    req.user = user; // we created our own custom header inside request called "user" while making custom header make sure they don't exist already.
    next();
}