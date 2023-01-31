import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/auth.slice";

export const store = configureStore({
    reducer: {
        user: authReducer,
    }
});