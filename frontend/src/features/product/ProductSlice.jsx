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

export const getAdminProducts = createAsyncThunk('products/getAdminProducts', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/admin/products', { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Products not found");
    }
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
        const { data } = await axios.post('/api/v1/admin/product/create', productData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create product");
    }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
        const { data } = await axios.put(`/api/v1/admin/products/${id}`, productData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/products/${id}`, { withCredentials: true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
});

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
        isDeleted: false,
        isUpdated: false,
        isCreated: false,
        successMessage: null,
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        resetProductStatus: (state) => {
            state.isCreated = false;
            state.isDeleted = false;
            state.isUpdated = false;
            state.successMessage = null;
        }
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

        // Admin Actions
        builder
            .addCase(getAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload?.products || [];
            })
            .addCase(getAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get products";
            });

        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.isCreated = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isCreated = action.payload.success;
                state.product = action.payload.product;
                state.successMessage = "Product created successfully!";
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Product creation failed";
            });

        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.isDeleted = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = action.payload.success;
                state.successMessage = "Product deleted successfully!";
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Product deletion failed";
            });

        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.isUpdated = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload.success;
                state.successMessage = "Product updated successfully!";
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Product update failed";
            });
    },
});

export const { removeError, resetProductStatus } = ProductSlice.actions;
export default ProductSlice.reducer;
