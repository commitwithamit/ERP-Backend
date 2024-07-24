import { Permission } from "../models/index.js";
import { CustomError } from "../utils/index.js";

export const addPermission = async (req, res)=>{
    const {permission} = req.body;

    if(!permission || permission.length === 0){
        throw new CustomError("Please add atleast one permission", 400);
    }

    const result = await Permission.insertMany(permission);

    res.status(201).json({
        success: true,
        result,
        message: "Permissions added Successfully."
    });
}