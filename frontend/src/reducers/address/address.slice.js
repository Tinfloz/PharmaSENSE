import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import addressService from "./address.service";

const initialState = {
    address: null,
    isSuccess: false,
    isLoading: false,
    isError: false,
    message: ""
};


export const reverseGeocodeUser = createAsyncThunk("reverse/geocode", async (details, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        const { latitude, longitude } = details;
        return await addressService.getAddress(latitude, longitude, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        resetAddress: state => initialState,
        resetAddressHelpers: state => ({
            ...initialState,
            address: state.address
        })
    },
    extraReducers: builder => {
        builder
            .addCase(reverseGeocodeUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(reverseGeocodeUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.address = action.payload.address
            })
            .addCase(reverseGeocodeUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { resetAddress, resetAddressHelpers } = addressSlice.actions;
export default addressSlice.reducer;