import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./auth.service";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
};

// register user
export const registerUser = createAsyncThunk("register/user", async (creds, thunkAPI) => {
    try {
        return await userService.register(creds);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// login user
export const loginUser = createAsyncThunk("login/user", async (creds, thunkAPI) => {
    try {
        return await userService.login(creds);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// set address
export const setAddressLoginUser = createAsyncThunk("set/address", async (addressDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await userService.setAddressUser(addressDetails, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: state => initialState,
        resetAuthHelpers: state => ({
            ...initialState,
            user: state.user
        })
    },
    extraReducers: builder => {
        builder
            .addCase(registerUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.sendUser
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(loginUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.sendUser;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(setAddressLoginUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(setAddressLoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newLoginUser = {
                    ...state.user.loginUser,
                    address: action.payload.address
                };
                const newUser = {
                    ...state.user,
                    loginUser: newLoginUser
                };
                state.user = newUser;
            })
            .addCase(setAddressLoginUser.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload;
            })
    }
});

export const { resetAuth, resetAuthHelpers } = authSlice.actions;
export default authSlice.reducer;