import express from "express"
import dotenv from "dotenv";
import authRoutes from "./routes/auth_route.js"; // importing auth routes
import messageRoutes from "./routes/message_route.js"; // importing message routes
import path from "path"; // to get the current directory path

dotenv.config();

const app = express();
const __dirname = path.resolve(); // to get the current directory path

app.use(express.json());

const PORT = process.env.PORT || 3000;


//it is for import api routes from auth_route.js folder
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


// this is for deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*path", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
