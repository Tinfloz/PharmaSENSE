import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
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

export const deleteLoginChemistStore = createAsyncThunk("delete/store", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await chemistService.deleteMyStore(token, id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const changeLoginChemistStoreName = createAsyncThunk("store/name/change", async (nameDetails, thunkAPI) => {
    try {
        const { name, id } = nameDetails;
        const token = thunkAPI.getState().user.user.token;
        return await chemistService.changeStoreName(token, name, id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const changeChemistStoreAddress = createAsyncThunk("change/address", async (changeDetails, thunkAPI) => {
    try {
        const { addressDetails, id } = changeDetails;
        const token = thunkAPI.getState().user.user.token;
        return await chemistService.setStoreAddress(id, addressDetails, token);
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
            .addCase(deleteLoginChemistStore.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteLoginChemistStore.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newStore = state.store.filter(element => element._id !== action.payload.id);
                state.store = newStore;
            })
            .addCase(deleteLoginChemistStore.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(changeLoginChemistStoreName.pending, state => {
                state.isLoading = true;
            })
            .addCase(changeLoginChemistStoreName.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newStore = state.store.map(element => {
                    if (element._id === action.payload.id) {
                        element.name = action.payload.name;
                    }
                    return element;
                });
                console.log(newStore, "new store");
                state.store = newStore;
            })
            .addCase(changeLoginChemistStoreName.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(changeChemistStoreAddress.pending, state => {
                state.isLoading = true;
            })
            .addCase(changeChemistStoreAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                console.log(action.payload);
                const newStore = state.store.map(element => {
                    if (element._id === action.payload.id) {
                        element.address = action.payload.address;
                        let location = {
                            type: "Point",
                            coordinates: [action.payload.longitude, action.payload.latitude]
                        };
                        element.location = location;
                    };
                    return element
                });

                state.store = newStore;
                console.log(current(state).store);
            })
            .addCase(changeChemistStoreAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { resetChemist, resetChemistHelpers } = chemistSlice.actions;
export default chemistSlice.reducer;