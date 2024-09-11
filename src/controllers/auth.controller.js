import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generate } from "generate-password";
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

const checkPassword = async (password, actualPassword) => {
    const isMatched = await bcrypt.compare(password, actualPassword);

    if (!isMatched) {
        throw new CustomError("Your Password is incorrect!", 401);
    }
    return true;
}

const checkEmail = async (email) => {
    return await User.findOne({ email })
    .populate({path:"role", select:"_id name"})
    .populate({path:"deptId", select: "_id name"})
    .populate({path:"userPermissions", select: "_id name"})
}

const passwordGenerator = () => {
    return generate({
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilarCharacters: true,
    });
}

const createAdmin = async (email, password) => {
    // a. Role create
    const role = await Role.create({ name: "Admin" });
    // b. Management dept create
    const dept = await Department.create({ name: "Management" });
    // c. Hash the password
    const hashedPassword = await hashPassword(password);
    // d. fetch admin permissions 
    const permissions = await Permission.find({
        name: "Administrator Access",
    }).select("_id"); // this will get us the id

    //  - login access
    //  - Administrator Access
    // a. Admin user create, 
    const user = await User.create({ //User.create is 1st method to inset in db
        email,
        password: hashedPassword,
        role: role._id,
        deptId: dept._id,
        userPermissions: permissions,
    });
    return user;
}

const generateAccessToken = (userId) => {
    // to generate access/refresh token use this in node console(repel)
    // require("crypto").randomBytes(64).toString("hex") //we can choose between 64bit or 32bit
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "10m" }
    );
}
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "7d" }
    );

}

const verifyRefreshToken = (token)=>{
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
        return decodedToken;
    }catch(err){
        throw new CustomError("Session Expired.", 403);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new CustomError("Please fill all the fields", 400);
    }
    
    // 1. check whether any user exists or not (if none then create user as admin)
    const existingUser = await User.find();  // find = [], findOne = {}
    
    if (existingUser.length === 0) {
        const user = await createAdmin(email, password);
        if (user) {
            return res
                .status(201)
                .json({
                    success: true,
                    message: "Admin created successfully",
                    user
                });
        }
    }
    // 2. Check whether the email exists or not
    const user = await checkEmail(email);
    if (!user) {
        throw new CustomError("Your account doesn't exist!", 401);
    }

    // 3. check password
    await checkPassword(password, user.password);

    // 4. generate Access and Refresh Token
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    // sending user relevant data to show on frontend
    const userObj = {
        userId: user._id,
        name: user?.name, // if any
        email: user.email,
        role: user.role,
        department: user.deptId,
        userPermissions: user.userPermissions,
    }

    res.cookie("jwt", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
        // domain: ".abc.com", //subdomain
    })

    res
    .status(200)
    .json({
        success:true,
        message:"Login Successfully.",
        accessToken,
        user: userObj,
    });
}

export const registerUser = async (req, res) => {
    const { email, role, deptId } = req.body;

    if (!email) {
        throw new CustomError("Please fill all the fields.", 400);
    }
    // 1. Check wheather the email already exists or not
    const userExist = await checkEmail(email);

    if (userExist) {
        throw new CustomError("User with this email already exists.", 400);
    }

    // 2. password generate
    const password = passwordGenerator();
    console.log(password);

    // 3. password hash
    const hashedPassword = await hashPassword(password);

    // 4. DB insert
    const user = new User(); // this is 2nd method to insert in db & 3rd is insert of mongodb
    user.email = email;
    user.password = hashedPassword;
    user.role = role;
    user.deptId = deptId;

    const result = await user.save();

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: result
    });
    // 5. mail -> email, password
}

export const getNewAccessToken = async (req, res) => {
    const refreshToken = req?.cookies?.jwt;

    // now let's verify if it is the same token or not
    if(!refreshToken){
        throw new CustomError("Session Expired", 403);
    }
    const decodedToken = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(decodedToken.userId);
    const user = await User.findById(decodedToken.userId);

    const userObj = {
        userId: user._id,
        name: user?.name, // if any
        email: user.email,
        role: user.role,
        department: user.deptId,
        userPermissions: user.userPermissions,
    }
    res.status(200).json({accessToken, user:userObj});
}

export const logout = async (req, res) => {
    res.clearCookie("jwt",{
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
        // domain: ".abc.com", //subdomain
    });
    res.status(204).end();
}

// users non hashed passwords
// amit@gmail.com = abc123
// yogita@gmail.com = d2B.FK^E7qAH
// amitarteva1@gmail.com = tV@dHMV6"H:>
// akak61999@gmail.com = T}&f/kc+RP]j