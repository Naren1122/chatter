import User from "../models/user.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";

export const signup = async(req,res)=>{
   const {fullName,email,password} = req.body;

   try{
    if(!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required"});
   }

   if (password.length <6){
    return res.status(400).json({message:"Password must be at least 6 characters"});
   }

   //check if user emails valid:regex
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"Invalid email format"});
    }
    
    //check if user already exists through email
   const user = await User.findOne({email});
   if(user){
    return res.status(400).json({message:"User already exists"});
   } 
 
   //hash password
   const salt = await bcrypt.genSalt(10); 
   const hashedPassword = await bcrypt.hash(password,salt);


   // create new user
   const newUser = new User({
    fullName,
    email,
    password:hashedPassword,
   })

   //generate token for user and saver user to db
   if (newUser){
    generateToken(newUser._id,res);
    await newUser.save();

    res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic,
    });
   }
   else{
       res.status(400).json({message:"Invalid user data"});
   }
}
    catch(error){
       console.log("Error in Signup:",error);
       res.status(500).json({message:"Internal Server Error"})
    }
};