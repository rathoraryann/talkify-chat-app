import { configureStore } from "@reduxjs/toolkit"
import userSlice from './slice/userSlice'
import chatSlice from "./slice/chatSlice"

const store = configureStore({
    reducer: {
        userSlice: userSlice,
        chatSlice: chatSlice
    }
})

export default store;