import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import drugService from "./drugs.service";

const initialState = {
    drug: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const getAllLoginUserDrugs = createAsyncThunk("drugs/user", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await drugService.getAllDrugsUser(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const deleteDrugsLoginUser = createAsyncThunk("delete/drugs", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await drugService.deleteDrugsUser(token, id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const drugSlice = createSlice({
    name: "drugs",
    initialState,
    reducers: {
        resetDrug: state => initialState,
        resetDrugHelpers: state => ({
            ...initialState,
            drug: state.drug
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getAllLoginUserDrugs.pending, state => {
                state.isLoading = true;
            })
            .addCase(getAllLoginUserDrugs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.drug = action.payload.drugs;
            })
            .addCase(getAllLoginUserDrugs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteDrugsLoginUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteDrugsLoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newDrug = state.drug.filter(element => element._id !== action.payload.id);
                state.drug = newDrug;
            })
            .addCase(deleteDrugsLoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { resetDrug, resetDrugHelpers } = drugSlice.actions;
export default drugSlice.reducer;