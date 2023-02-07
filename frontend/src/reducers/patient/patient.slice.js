import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import patientService from "./patient.service";

const initialState = {
    patientDetails: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const createMedLoginUser = createAsyncThunk("create/med", async (medDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await patientService.addNewMed(medDetails, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const createMedPhotoLoginUser = createAsyncThunk("photo/med", async (medDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await patientService.addNewMedByPhoto(medDetails, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const patientSlice = createSlice({
    name: "patient",
    initialState,
    reducers: {
        resetPatient: state => initialState,
        resetPatientHelpers: state => ({
            ...initialState,
            patientDetails: state.patientDetails
        })
    },
    extraReducers: builder => {
        builder
            .addCase(createMedLoginUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(createMedLoginUser.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createMedLoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createMedPhotoLoginUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(createMedPhotoLoginUser.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createMedPhotoLoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { resetPatient, resetPatientHelpers } = patientSlice.actions;
export default patientSlice.reducer;