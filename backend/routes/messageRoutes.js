const { sendMessage, allMessages } = require("../controllers/messageController");
const authMiddleWare = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post('/', authMiddleWare, sendMessage)
router.get('/:chatId', authMiddleWare, allMessages)

module.exports = router;