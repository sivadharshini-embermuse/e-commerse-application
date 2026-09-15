import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for cart operations
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (cartItem, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/api/v1/cart/add', cartItem);
            return data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/cart');
            return data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete('/api/v1/cart/remove', {
                data: { productId },
            });
            return data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

export const updateCartQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put('/api/v1/cart/update', {
                productId,
                quantity,
            });
            return data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete('/api/v1/cart/clear');
            return data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

// Helper function to get initial state from localStorage
const getInitialState = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            return JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }

    return {
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
        loading: false,
        error: null,
    };
};

const initialState = getInitialState();

// Helper function to save cart to localStorage
const saveToLocalStorage = (state) => {
    try {
        localStorage.setItem('cart', JSON.stringify(state));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Local add to cart (fallback for offline)
        addToCartLocal: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find(
                (cartItem) => cartItem.productId === item.productId
            );

            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
            } else {
                state.items.push({
                    ...item,
                    quantity: item.quantity || 1,
                });
            }

            state.totalQuantity = state.items.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            state.totalPrice = state.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            saveToLocalStorage(state);
        },
    },
    extraReducers: (builder) => {
        // Add to cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const cart = action.payload;
                state.items = cart.items || [];
                state.totalPrice = cart.totalPrice || 0;
                state.totalQuantity = cart.totalQuantity || 0;
                saveToLocalStorage(state);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get cart
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                const cart = action.payload;
                if (cart) {
                    state.items = cart.items || [];
                    state.totalPrice = cart.totalPrice || 0;
                    state.totalQuantity = cart.totalQuantity || 0;
                }
                saveToLocalStorage(state);
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Remove from cart
        builder
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                const cart = action.payload;
                state.items = cart.items || [];
                state.totalPrice = cart.totalPrice || 0;
                state.totalQuantity = cart.totalQuantity || 0;
                saveToLocalStorage(state);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update quantity
        builder
            .addCase(updateCartQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.loading = false;
                const cart = action.payload;
                state.items = cart.items || [];
                state.totalPrice = cart.totalPrice || 0;
                state.totalQuantity = cart.totalQuantity || 0;
                saveToLocalStorage(state);
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Clear cart
        builder
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.totalPrice = 0;
                state.totalQuantity = 0;
                saveToLocalStorage(state);
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addToCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
