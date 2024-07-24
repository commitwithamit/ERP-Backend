import { Department } from "../models/index.js";
import {CustomError} from "../utils/index.js";


export const createDept =  async (req, res)=>{
    const {name} = req.body;

    if(!name){ 
        throw new CustomError("Please fill all the fields.", 400);
    }

    // this will add name to departments collection
    // both the bellow lines are same when key and value has same name then we don't need to do this "name: name";
    // const department = await Department.create({name : name});
    const department = await Department.create({name});

    res.status(201).json({
        success: true,
        department,
        message: "Department Created Successfully."
    });
}


export const getDept = async (req, res)=>{
    const departments = await Department.find();

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

    const result = await Department.findByIdAndDelete(id);

    res.status(200).json({success:true, message: "Department deleted successfully"});
}

export const updateDept = async (req, res)=>{
    const {id} = req.params;
    const {name} = req.body;

    // check if neither of them is empty
    if(!name || !id){
        throw new CustomError("Please fill all the fields.", 400);
    }

    // finding the id which is to be updated
    const existingDeptIndex = await Department.findById(id);

    // checking if dept exist or not if not then findIndex will send -1 as a value
    if(!existingDeptIndex){
        throw new CustomError("The department does not exist.", 404);
    }

    const result = await Department.findByIdAndUpdate(id, {name});
    

    res.status(200).json({success:true, message: "Department Updated successfully"});
    // console.log(departments);
}