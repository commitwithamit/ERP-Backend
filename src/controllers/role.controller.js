import { Role } from "../models/index.js";
import { CustomError } from "../utils/index.js";

export const createRole = async (req, res)=>{
    const {name} = req.body;

    if(!name){
        throw new CustomError("Please fill all the fields", 400);
    }

    const role = await Role.create({name});

    res.status(201).json({
        success: true,
        role,
        message: "Role Created Successfully."
    });
}
export const getRoles = async (req, res)=>{

    const roles = await Role.find();

    res.status(201).json({
        success: true,
        data:roles,
    });
}