const asyncHandler = require("express-async-handler")
const Message = require("../models/messageModel")
const User = require("../models/userModel")
const Chat = require("../models/chatModel")


const sendMessage = asyncHandler(async (req, res) => {
    const { message, chatId } = req.body;
    if (!message || !chatId) {
        return res.sendStatus(400)
    }
    var newMessage = {
        sender: req.user._id,
        content: message,
        chat: chatId
    }
    try {
        var msg = await Message.create(newMessage)
        msg = await msg.populate("sender", "-password")
        msg = await msg.populate("chat")
        msg = await User.populate(msg, {
            path: "chat.users",
            select: "name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: msg })
        res.json(msg)
    } catch (error) {
        res.status(400)
        throw new Error(error.message);

    }
})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const msg = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat")
        res.status(200).json(msg)
    } catch (error) {
        res.status(400)
        throw new Error(error.message);

    }
})

module.exports = { sendMessage, allMessages }