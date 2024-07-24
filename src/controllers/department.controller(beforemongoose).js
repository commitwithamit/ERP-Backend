import {CustomError} from "../utils/index.js";

let departments = []; // we will store department data in this array

export const createDept =  (req, res, next)=>{
    const {id, name} = req.body;

    if(!id || !name){
        // error if any or both of them are empty 
        // Note we can not throw error here directly as this is a middleware and inside middleware we only do 2 things "send response" or "send to next middleware". so let's send this error to next middle ware
        // new CustomError("Please fill all the fields.", 400); // shouldn't do this here
        return next(new CustomError("Please fill all the fields.", 400));
        // now we will have to create a "next" middleware where we will handle this error
    }

    // this will add id and name to departments array
    departments.push({id, name});

    // console.log("Inside create Dept handler"); // for checking if we are reaching here or not
    // res.send() // we can send response using send method but usually we send using json method 
    // status 200 = success | 201 = success + created
    res.status(201).json({
        success: true,
        message: "Department Created Successfully."
    });
}


export const getDept = (req, res, next)=>{
    res.status(200).json({
        success: true,
        data: departments, // to check if departments were added or not
    });
}

export const deleteDept = (req, res, next)=>{
    const {id} = req.params;

    const updatedDepts = departments.filter((item)=> item.id !== id);
    departments = updatedDepts;

    res.status(200).json({success:true, message: "Department deleted successfully"});
}

export const updateDept = (req, res, next)=>{
    const {id} = req.params;
    const {name} = req.body;

    // check if neither of them is empty
    if(!name || !id){
        return next (new CustomError("Please fill all the fields.", 400));
    }

    // finding the id which is to be updated
    const existingDeptIndex = departments.findIndex((item)=>item.id === id);

    // checking if dept exist or not if not then findIndex will send -1 as a value
    if(existingDeptIndex < 0){
        return next (new CustomError("The department does not exist.", 404));
    }

    departments[existingDeptIndex] = {id:id, name};
    

    res.status(200).json({success:true, message: "Department Updated successfully"});
    // console.log(departments);
}