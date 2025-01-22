const router = require("express").Router();
const { accessChat, fetchChats, createGroupChat, removeFromGroup, addToGroup, renameChat } = require("../controllers/chatController");
const authMiddleWare = require("../middlewares/authMiddleware");

router.post("/", authMiddleWare, accessChat)
router.get("/", authMiddleWare, fetchChats)
router.post("/group", authMiddleWare, createGroupChat)
router.put("/rename", authMiddleWare, renameChat)
router.put("/groupadd", authMiddleWare, addToGroup)
router.put("/groupremove", authMiddleWare, removeFromGroup)

module.exports = router;