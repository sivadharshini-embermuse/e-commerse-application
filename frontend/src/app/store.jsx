import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/ProductSlice';
import userReducer from '../features/user/userSlice';
export const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer,
    },
});