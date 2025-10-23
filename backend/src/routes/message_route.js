import express from "express"
import { getAllContacts ,getMessagesByUserId , sendMessage,getChatPartners} from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();
router.use(protectRoute,arcjetProtection);

router.get("/contacts",getAllContacts);
router.get("/chats",getChatPartners);
router.get("/:id",getMessagesByUserId);

router.post("/send/:id",sendMessage);

export default router;