import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/auth.slice";
import addressReducer from "./reducers/address/address.slice";
import chemistReducer from "./reducers/chemist/chemist.slice";
import deliveryReducer from "./reducers/deliveries/deliveries.slice";

export const store = configureStore({
    reducer: {
        user: authReducer,
        address: addressReducer,
        chemist: chemistReducer,
        delivery: deliveryReducer,
    }
});