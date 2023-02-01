import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chemistService from "./chemist.service";

const initialState = {
    store: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

export const createStoreLoginChemist = createAsyncThunk("create/store", async (storeDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await chemistService.createStoreChemist(storeDetails, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const getAllLoginChemistStores = createAsyncThunk("stores/get", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await chemistService.getAllMyStores(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const chemistSlice = createSlice({
    name: "chemist",
    initialState,
    reducers: {
        resetChemist: state => initialState,
        resetChemistHelpers: state => ({
            ...initialState,
            store: state.store
        })
    },
    extraReducers: builder => {
        builder
            .addCase(createStoreLoginChemist.pending, state => {
                state.isLoading = true;
            })
            .addCase(createStoreLoginChemist.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createStoreLoginChemist.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllLoginChemistStores.pending, state => {
                state.isLoading = true;
            })
            .addCase(getAllLoginChemistStores.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.store = action.payload.stores;
            })
            .addCase(getAllLoginChemistStores.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { resetChemist, resetChemistHelpers } = chemistSlice.actions;
export default chemistSlice.reducer;