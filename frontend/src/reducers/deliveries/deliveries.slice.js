import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import deliveryService from "./deliveries.service";

const initialState = {
    deliveries: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};


export const getMyStoreDeliveries = createAsyncThunk("deliveries/nearby", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await deliveryService.getNearbyStoreDeliveries(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const deliverySlice = createSlice({
    name: "deliveries",
    initialState,
    reducers: {
        resetDelivery: state => initialState,
        resetDeliveryHelpers: state => ({
            ...initialState,
            deliveries: state.deliveries
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getMyStoreDeliveries.pending, state => {
                state.isLoading = true;
            })
            .addCase(getMyStoreDeliveries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries = action.payload.deliveries;
            })
            .addCase(getMyStoreDeliveries.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.deliveries
            })
    }
});

export const { resetDelivery, resetDeliveryHelpers } = deliverySlice.actions;
export default deliverySlice.reducer;
