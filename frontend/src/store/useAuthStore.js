import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({ // this code is for auth store
   authUser:null, 
   isCheckingAuth:true,
   isSigningUp:false,
   isLoggingIn:false, 

   // so what it does is it will check if the user is authenticated or not
   checkAuth:async()=>{
    try{
        const res = await axiosInstance.get("/auth/check");// it will send a get request to the server to check if the user is authenticated or not
        // Only set authUser if we actually have user data
        if (res.data && res.data.user) {
            set({authUser:res.data.user});
        } else {
            set({authUser:null});
        }
    }catch(error){
        console.error("Error in authCheck:", error);
        set({authUser:null});
    }finally{
        set({isCheckingAuth:false});
    }
   },

   signup: async(data)=>{
    set({isSigningUp:true}); //here set is used to set the state of the store ie. isSigningUp to true which indicate that the user is signing up
    try{
        const res = await axiosInstance.post("/auth/signup",data); // it will send a post request to the server to create a new user
        set({authUser:res.data}); // it will set the authUser to the response data which is the user that is created

        toast.success("User account created successfully");
    }catch(error){
        toast.error(error.response?.data?.message || "Error in signup");
    }finally{
        set({isSigningUp:false});
    
   }
},

login:async(data)=>{
    set({isLoggingIn:true});
    try{
        const res = await axiosInstance.post("/auth/login",data); 
        set({authUser:res.data});

        toast.success("Logged in Successfully");

        
    }catch(error){
        toast.error(error.response?.data?.message || "Error in login");
    }finally{
        set({isLoggingIn:false});
    }
},

logout: async()=>{
    try{
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logged out Successfully");
    }catch(error){
        toast.error("Error logging out");
        console.log("Logout error:",error);
    }
},

}));