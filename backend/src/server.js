import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth_route.js"; // importing auth routes
import messageRoutes from "./routes/message_route.js"; // importing message routes
import path from "path"; // to get the current directory path
import {connectDB} from "./lib/db.js"; // importing connectDB function from db.js file
import {ENV} from "./lib/env.js";
import cors from "cors"

dotenv.config();

const app = express();
const __dirname = path.resolve(); // to get the current directory path

app.use(express.json());// req.body
app.use(cors({origin:ENV.CLIENT_URL,credentials:true})); // to allow requests from the frontend
app.use(express.urlencoded({extended:false})); // parse form data

app.use(cookieParser()); // parse cookies

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

const PORT = ENV.PORT || 3000;


//it is for import api routes from auth_route.js folder
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


// this is for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*path", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
   connectDB();

});
