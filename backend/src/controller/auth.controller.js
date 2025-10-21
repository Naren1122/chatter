import User from "../models/user.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";
import "dotenv/config";
import {sendWelcomeEmail} from "../emails/emailHandlers.js";
import {ENV} from "../lib/env.js";

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
    const savedUser = await newUser.save();
    generateToken(savedUser._id,res);

    res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic,
    });
     
    // send welcome email to user

    try{
        await sendWelcomeEmail(savedUser.email, savedUser.fullName,ENV.CLIENT_URL);
    }catch(error){
        console.error("Failed to send welcome email:", error);

   }
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


export const login = async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);
        res.status(200).json({
            message:"Login successful",
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });

    } catch(error){
        console.log("Error in Login controller:",error);
        res.status(500).json({message:"Internal Server Error"})
    }
};


export const logout = (req,res)=>{
 
    res.cookie("jwt","",{
        maxAge:0 });//set cookie expiration to 0 to delete it
    res.status(200).json({message:"Logged out successfully"});
};