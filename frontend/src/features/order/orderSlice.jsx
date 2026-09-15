import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



// Create new order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `/api/v1/new/order`,
                orderData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

// Get single order
export const getOrder = createAsyncThunk(
    'order/getOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `/api/v1/order/${orderId}`,
                { withCredentials: true }
            );
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

// Get all user orders
export const getAllOrders = createAsyncThunk(
    'order/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `/api/v1/orders`,
                { withCredentials: true }
            );
            return response.data.orders;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// Admin: Get all orders
export const getAdminOrders = createAsyncThunk(
    'order/getAdminOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `/api/v1/admin/orders`,
                { withCredentials: true }
            );
            return response.data.orders;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin orders');
        }
    }
);

// Admin: Update order status
export const updateAdminOrder = createAsyncThunk(
    'order/updateAdminOrder',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `/api/v1/admin/order/update/${id}`,
                { status },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
        }
    }
);

// Admin: Delete order
export const deleteAdminOrder = createAsyncThunk(
    'order/deleteAdminOrder',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `/api/v1/admin/order/${id}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete order');
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
        isUpdated: false,
        isDeleted: false,
        successMessage: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetOrder: (state) => {
            state.currentOrder = null;
        },
        resetOrderStatus: (state) => {
            state.isUpdated = false;
            state.isDeleted = false;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        // Create Order
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Single Order
        builder
            .addCase(getOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get All Orders
        builder
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Admin: Get All Orders
        builder
            .addCase(getAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Admin: Update Order
        builder
            .addCase(updateAdminOrder.pending, (state) => {
                state.loading = true;
                state.isUpdated = false;
            })
            .addCase(updateAdminOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload.success;
                state.successMessage = action.payload.message || "Order updated successfully";
            })
            .addCase(updateAdminOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Admin: Delete Order
        builder
            .addCase(deleteAdminOrder.pending, (state) => {
                state.loading = true;
                state.isDeleted = false;
            })
            .addCase(deleteAdminOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = action.payload.success;
                state.successMessage = action.payload.message || "Order deleted successfully";
            })
            .addCase(deleteAdminOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, resetOrder, resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
