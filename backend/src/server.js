import express from "express"
import dotenv from "dotenv";
import authRoutes from "./routes/auth_route.js"; // importing auth routes
import messageRoutes from "./routes/message_route.js"; // importing message routes

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


//it is for import api routes from auth_route.js folder
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
