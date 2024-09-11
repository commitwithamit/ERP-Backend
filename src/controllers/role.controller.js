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

    // below line was used once to add isRoleDeleted: false in every role in database because it was not present earlier
    // await Role.updateMany({}, {$set: {isRoleDeleted:false}});

    const roles = await Role.find({isRoleDeleted: false});

    res.status(201).json({
        success: true,
        data:roles,
    });
}

export const editRole = async (req, res)=>{

    const {roleId} = req.params;
    const {name} = req.body;

    if(!roleId || !name){
        throw new CustomError("Please fill all the fields.", 400); // 400 bad request
    }

    const result = await Role.findByIdAndUpdate(roleId, {name});
    // await Role.updateOne({_id: roleId}, {$set: {name: name}});

    res.status(200).json({
        success: true,
        message: "Role updated successfully.",
    });
}

export const deleteRole = async (req, res) =>{
    const {roleId} = req.params;

    if(!roleId){
        throw new CustomError("Please fill all the fields.", 400);
    }

    await Role.findByIdAndUpdate(roleId, { isRoleDeleted: true});

    res.status(200).json({
        success: true,
        message:"Role deleted successfully",
    });
}