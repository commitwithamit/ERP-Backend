import mongoose from "mongoose";
import { Department, User } from "../models/index.js";

export const getUsers = async (req, res) => {
    // pagination
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 5;
    // filter
    const { deptId } = req.query;

    const offset = limit * (page - 1); // offset means how many documents do we need to skop

    let query = { _id: { $ne: req.user._id } };

    if (deptId) {
        query = { ...query, deptId: new mongoose.Types.ObjectId(deptId) };
    }

    // console.log(req.user._id); // req.user is coming from verifyJWT
    const users = await User.find({ _id: { $ne: req.user._id } })
        .populate({
            path: "role",
            select: "name",
        })
        .populate({
            path: "deptId",
            select: "name managerId",
            populate: { path: "managerId", select: "name email" },
        })
        .select("-updatedAt -password")
        .limit(limit)
        .skip(offset);

    const userCount = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        data: users,
        totalUsers: userCount,
        totalPages: Math.ceil(userCount / limit),
    });

}

export const getAvailableManagers = async (req, res) => {
    const query1 = User.find().select("name email");
    const query2 = Department.find({ managerId: { $exists: true } }).select("managerId -_id"); // not selecting id so we have put a - ahead of _id

    const [users, depts] = await Promise.all([query1, query2]);

    // console.log(users);
    // console.log(depts);

    /*
     in case where there is no manager assigned to any departement than query2 will return an empty array in that case we will send all users as available managers
    */
    if (depts.length === 0) {
        return res.status(200).json({ success: true, data: users });
    }

    const existingManagerIds = depts.map((item) => item.managerId.toString());

    const filteredUsers = users.filter((user) => {
        return !existingManagerIds.includes(user.id.toString());
    });
    res.status(200).json({ success: true, data: filteredUsers });
}



// alternative
// const filteredUsers = users.filter((user) => {
//     return !depts.some(
//         (dept) => dept.managerId.toString() === user._id.toString()
//     );
// });














// return !depts.some(
//     (dept) => dept.managerId.toString() === user._id.toString()
// );