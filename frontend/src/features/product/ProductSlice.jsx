import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';


export const getProducts = createAsyncThunk('products/getProducts', async ({ keyword, category, page = 1 } = {}, { rejectWithValue }) => {

    try {
        // Simulating an API call
        // const link="/api/v1/products";
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (category) params.set("category", category);
        params.set("page", page);
        const link = `/api/v1/products?${params.toString()}`;

        const {data} = await axios.get(link);
        console.log(data)
        return data;
        
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "product not found");
    }
});

export const getProductDetails = createAsyncThunk('products/getProductDetails', async (id, { rejectWithValue }) => {

    try {
        // Simulating an API call
        const link=`/api/v1/product/${id}`;
        const {data} = await axios.get(link);
        console.log(data)
        return data;
        
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "product not found");
    }
});

export const createReview = createAsyncThunk(
    "products/createReview",
    async (reviewData, { rejectWithValue }) => {
        try {
        const { data } = await axios.put(
            "/api/v1/review",
            reviewData
        );

        return data;
        } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
        }
    }
);

const ProductSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product:null,
        resultPerPage: 5,
        totalpages: 0,
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                console.log("Fulfilled:", action.payload);
                state.loading = false;
                state.products = action.payload?.products || [];
                state.error = null;
                state.productCount = action.payload?.Productcount || action.payload?.ProductCount || 0;
                state.resultPerPage = action.payload?.resultPerPage || state.resultPerPage;
                state.totalpages = action.payload?.totalpages || 0;
                state.currentpage = action.payload?.currentpage || 1;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message||'product not found';
            });

        builder
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                console.log("Fulfilled:", action.payload);
                state.loading = false;
                state.product = action.payload?.product;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.product = [];
                state.error = action.payload || action.error.message||'product not found';
            });
    },
});

export const { removeError } = ProductSlice.actions;
export default ProductSlice.reducer;
