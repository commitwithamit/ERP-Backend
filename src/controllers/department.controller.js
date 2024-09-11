import mongoose from "mongoose";
import { Department, User } from "../models/index.js";
import {CustomError} from "../utils/index.js";


export const createDept =  async (req, res)=>{
    const {name, managerId} = req.body;

    if(!name){ 
        throw new CustomError("Please fill all the fields.", 400);
    }

    const session = await mongoose.startSession();

    try{
        session.startTransaction();

        const [department] = await Department.create([{name, managerId}], {session});

        if(managerId){
            await User.findByIdAndUpdate(managerId, {deptId: department._id}, {session});
        }

        const populatedDepartment = await Department.findById(department._id).populate({
            path: "managerId", select: "name email"
        }).session(session);

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            department: populatedDepartment,
            message: "Department Created Successfully."
        });
    }catch(err){
        await session.abortTransaction();

        return res.status(500).json({message:"Unable to create department"});
    }finally{
        session.endSession();
    }

    /*
    // this will add name to departments collection
    // both the bellow lines are same when key and value has same name then we don't need to do this "name: name";
    // const department = await Department.create({name : name});
    // const department = await Department.create({name});
    
    const department = await Department.create(req.body);

    await User.findByIdAndUpdate(managerId, {deptId: department._id});
    */ 

    
}

export const getDept = async (req, res)=>{
    const departments = await Department.find({isDeptDeleted: false}).populate({
        path: "managerId", select: "name email"
    });

    res.status(200).json({
        success: true,
        data: departments, // to check if departments were added or not
    });
}

export const deleteDept = async (req, res)=>{
    const {id} = req.params;
    const department = await Department.findById(id);

    if(!department){
        throw new CustomError("Department does not exist", 400);
    }

    // below line was used once to add isDeptDeleted: false in every department document in database because it was not present earlier
    // await Department.updateMany({}, {$set: {isDeptDeleted:false}});

    await Department.findByIdAndUpdate(id, {
        isDeptDeleted: true,
    });

    res.status(200).json({success:true, message: "Department deleted successfully"});
}

export const updateDept = async (req, res)=>{
    const {id} = req.params;
    const {name, managerId} = req.body;

    // check if neither of them is empty
    if(!name || !id || !managerId){
        throw new CustomError("Please fill all the fields.", 400);
    }

    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        // finding the id which is to be updated
        const existingDeptIndex = await Department.findById(id).session(session);
    
        // checking if dept exist or not if not then findIndex will send -1 as a value
        if(!existingDeptIndex){
            throw new CustomError("The department does not exist.", 404);
        }
    
        await Department.findByIdAndUpdate(id, req.body, {session});

        // updating managerId accordingly in user document
        const upUser = await User.findByIdAndUpdate(managerId, {deptId:id}, {session});
        
        await session.commitTransaction(); 
    
        res.status(200).json({
            success:true,
            message: "Department Updated successfully",
            data: upUser
        });
        // console.log(departments);
    }catch(err){
        console.log(err);
        await session.abortTransaction();
        return res.status(500).json({message: "Unabel to update department"});
    }finally{
        session.endSession();
    }
}