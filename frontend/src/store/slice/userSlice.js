import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        status: false,
        userData: null
    },
    reducers: {
        login: (state, action)=>{
            state.status= true,
            state.userData = action.payload.data
        },
        logout: (state)=>{
            state.status = false,
            state.userData = null
        }
    }
})

export default userSlice.reducer;
export const {login, logout} = userSlice.actions;