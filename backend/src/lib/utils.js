import jwt from "jsonwebtoken";
import {ENV} from "./env.js";

export const generateToken = (userId,res)=>{

   const {JWT_SECRET} = ENV;
   if (!JWT_SECRET) {
       throw new Error("JWT_SECRET is not defined in environment variables");
   }

    const token = jwt.sign({userId},JWT_SECRET,{
        expiresIn:"7d",
    }); //this line creates a token with userId as payload and secret key from env file and expiration time of 7 days

    res.cookie("jwt",token,{
        maxAge:1000*60*60*24*7, //7 days    //httpOnly:true, //this makes the cookie inaccessible to js
        httpOnly:true, //this makes the cookie inaccessible to js and helps prevent XSS attacks which means in simple terms that the cookie cannot be accessed or modified by client-side scripts
        sameSite:"Strict", // it prevents the browser from sending this cookie along with cross-site requests. This helps mitigate CSRF (Cross-Site Request Forgery) attacks
        secure:ENV.NODE_ENV === "development" ? false : true,
    });
    return token;
};

// http://localhost:3000 here in development mode we dont want to use https so we set secure to false
// https://yourdomain.com here in production mode we want to use https so we set secure to true