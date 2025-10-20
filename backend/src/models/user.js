// User model definition
// This file defines the user schema using Mongoose and exports it for use in other parts of the application

import mongoose from "mongoose";

// Define the user schema with all required fields
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model("User", userSchema);

// Default export of the User model
export default User;

// Named exports can also be added if needed
export { User };
