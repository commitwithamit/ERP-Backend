import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";
import bcrypt from "bcryptjs";

const hashPassword = async(password) =>{
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

const createAdmin = async (email, password)=>{
    // a. Role create
    const role = await Role.create({name:"admin"});
    // b. Management dept create
    const dept = await Department.create({name:"Management"});
    // c. Hash the password
    const hashedPassword = await hashPassword(password);
    // d. fetch admin permissions 
    const permissions = await Permission.find({
        name: "Administrator Access",
    }).select("_id"); // this will get us the id

    //  - login access
    //  - Administrator Access
    // a. Admin user create, 
    const user = await User.create({
        email,
        password: hashedPassword,
        role: role._id,
        deptId: dept._id,
        userPermissions:permissions,
    });
    return user;
}

export const login = async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new CustomError("Please fill all the fields", 400);
    }

    // 1. check whether any user exists or not (if none then create user as admin)
    const existingUser = await User.find();  // find = [], findOne = {}

    if(existingUser.length === 0){
        const user = await createAdmin(email,password);
        if(user){
            return res
            .status(201)
            .json({
                success: true,
                message: "Admin created successfully",
                user
            });
        }
    }
    // 1. Check whether the email exists or not
}