import express from "express"
import {signup,login, logout, updateProfile} from "../controller/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";
import {arcjetProtection} from "../middleware/arcjet.middleware.js";

const router = express.Router();


router.use(arcjetProtection);

router.get("/test", (req,res)=>{
    res.status(200).json({message:"You are authenticated"});
});

router.post("/signup",signup);

router.post("/login" ,login);

router.post("/logout",logout);

router.post("/update-profile",protectRoute, updateProfile);



router.get("/check",protectRoute,(req,res)=>{
    res.status(200).json({message:"You are authenticated", user: req.user });
});

export default router;