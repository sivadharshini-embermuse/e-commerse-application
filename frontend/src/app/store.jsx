import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import userReducer from '../features/user/userSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
        dashboard: dashboardReducer,
    },
});