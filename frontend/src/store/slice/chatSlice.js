import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chatSlice",
    initialState: {
        chats: null,
        selectedChat: null
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload.chats
        },
        unshiftChat: (state, action) => {
            state.chats = [action.payload.chat, ...state.chats]
        },
        removeChat: (state, action) => {
            const { chatId } = action.payload.id
            state.chats = state.chats.filter((chat) => chat.id !== chatId)
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload.chat
        },
        setSelectedChatGroupName: (state, action) => {
            state.selectedChat.chatName = action.payload.chatName
        },
        updateGroupName: (state, action) => {
            const { chatId, newChatGroupName } = action.payload
            const chatToUpdate = state.chats.find(chat => chat._id == chatId)
            if (chatToUpdate) chatToUpdate.chatName = newChatGroupName
        }
    }
})

export default chatSlice.reducer;
export const { setChats, unshiftChat, removeChat, setSelectedChat, setSelectedChatGroupName, updateGroupName } = chatSlice.actions