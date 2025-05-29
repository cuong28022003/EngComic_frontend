import { createSlice } from "@reduxjs/toolkit";
import {  } from "react-toastify";
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            user: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false
            state.login.user = action.payload
            
        },
        loginFalse: (state) => {
            state.login.error = true
        },
        logoutSuccess:(state)=>{
            state.login.user =null
        },
        registerSuccess:(state)=>{
            
        },
        updateUser: (state, action) => {
            state.login.user = {
                ...state.login.user,
                ...action.payload
            };
        }        

    }
})

export const {
    loginFalse,
    loginStart,
    loginSuccess,
    logoutSuccess,
    updateUser
}=authSlice.actions

export default authSlice.reducer