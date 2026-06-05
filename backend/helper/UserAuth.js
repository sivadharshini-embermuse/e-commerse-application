import HandleError from "./HandleError.js";
import jwt from "jsonwebtoken";
import User from "../model/UserModels.js";

export const verifyUser = async (req, res, next) => {
    const token = req.cookies?.token;    
    if (!token) {
        return next(new HandleError("Please login to access this resource", 401));
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new HandleError("Invalid token, please login again", 401));
    }
    req.user = await User.findById(decoded.id);
    if (!req.user) {
        return next(new HandleError("User not found, please login again", 401));
    }
    next(); 

};

export const rolebasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HandleError(`role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
