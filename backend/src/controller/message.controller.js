import Message from "../models/message.js"
import User from "../models/user.js"

export const getAllContacts =async (req,res)=>{
    try{
        const loggedInUserId = req.user._id;// get the logged in user's id from the request
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")// find all users except the logged in user, and exclude the password field .

        res.status(200).json(filteredUsers);
    }catch(error){
        console.log("Error in getAllContacts:",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}


// this is the route to get the messages between two users, ie the user to whom i want to send the message and me
export const getMessagesByUserId =async (req,res)=>{
    try{
        const myId =req.user._id; // this is the id of the logged in user , ie my id
        const {id:userToChatId} = req.params;// this is the id of the user to whom i want to send the message

        const messages =await Message.find({
            $or:[
                {senderId : myId,receiverId:userToChatId}, // here if i am the sender sending the message to the user, then sender id is my id 
                {senderId : userToChatId,receiverId:myId} // if other are sending me the message then receiver id is my id
            ],
        });
        res.status(200).json(messages);
    }catch(error){
        console.log("Error in getMessagesByUserId:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};


// this is the route to send the message to the user, ie the user to whom i want to send the message
export const sendMessage =async (req,res)=>{
    try {
        const {text,image} = req.body;  // this is the message body, where the message can either be text or image
        const {id: receiverId} = req.params; // this is the id of the user to whom i want to send the message
        const senderId = req.user._id;// this is the id of the logged in user , ie my id

        if(!text && !image) {return res.status(400).json({message:"Please enter a message or an image"}); // if the message is empty then return a 400 error
    }

    if(senderId.equals(receiverId)){
        return res.status(400).json({message:"Cannot send message to yourself"});
    }

    const receiverExists = await User.exists({_id:receiverId}); // check if the receiver exists in the database
    if(!receiverExists){
        return res.status(404).json({message:"Receiver does not exist"});
    }

        let imageUrl;
        if(image){
            const updateResponse = await cloudinary.uploader.upload(image);// upload the image to cloudinary and get the response, why cloudinary is used to store the image in the cloud and not in the database because it is a scalable solution and it is also a secure solution
            imageUrl = updateResponse.secure_url; // get the secure url of the image from the response
        }
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        }); // this is the message object that i want to send to the user, for example if i want to send a text message then i will create a new message object with the text and the receiver id and the sender id and the image url will be null
        await newMessage.save();
        res.status(201).json(newMessage);

    }catch (error){
        console.log("Error in sendMessage:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};


// this is the route to get the chat partners of the logged in user, ie the users with whom the logged in user has chatted with
export const getChatPartners = async (req,res)=>{
    try{
        const loggedInUserId = req.user._id; // get the logged in user's id from the request

        const messages =await Message.find({
            $or:[{senderId: loggedInUserId},{receiverId:loggedInUserId}]
        }); // find all the messages that are sent by the logged in user or received by the logged in user

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg)=>
                msg.senderId.toString()===loggedInUserId.toString()
            ?msg.receiverId.toString()
            :msg.senderId.toString()
        )
            ),
        ];  // this is the array of the ids of the users with whom the logged in user has chatted with, ie the users who are in the messages array
        const chatPartners = await User.find({_id:{$in:chatPartnerIds}}).select("-password"); // find all the users with the ids in the chatPartnerIds array and exclude the password field
    
        res.status(200).json(chatPartners);
    }catch(error){
        console.log("Error in getChatPartners:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
