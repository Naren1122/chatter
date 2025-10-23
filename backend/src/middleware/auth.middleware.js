import jwt from "jsonwebtoken";
import {ENV} from "../lib/env.js";
import User from "../models/user.js";


export const protectRoute =async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;// get token from cookies
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token,ENV.JWT_SECRET);//verify token and get payload
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");//get user from database excluding password through userId in payload
        if(!user){
            return res.status(404).json({message:"Unauthorized - User not found"});
        }

        req.user = user; //attach user to request object
        next();
    }catch(error){
        console.log("Error in protectRoute middleware:",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
};