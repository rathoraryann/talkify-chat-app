const mongoose = require("mongoose")

const chatSchema = mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdming: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    { timpstamps: true }
)

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat;