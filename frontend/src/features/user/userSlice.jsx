import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';


// register API
export const register = createAsyncThunk('user/register', async (userData,{rejectWithValue}) => {
    try{
        const config ={
            headers:{
                "Content-Type": "multipart/form-data",
            },  
        };
        const {data} =await axios.post("/api/v1/register",userData,config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Registration failed. try again later.");
    }
});

//get profile

export const loadUser = createAsyncThunk('user/loadUser', async (_,{rejectWithValue}) => {
    try{
        const config ={
            headers:{
                "Content-Type": "application/json",
            },  
        };
        const {data} =await axios.get("/api/v1/profile",{withCredentials:true,config});
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Profile retrieval failed. try again later.");
    }
});

// Reset Password
export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, passwords }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.put(
                `/api/v1/password/reset/${token}`,
                passwords,
                config
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to reset password",
                }
            );
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async (emailData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/v1/password/forgot",
                emailData,
                config
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

//update profile
export const updateProfile = createAsyncThunk('user/updateProfile', async (userData,{rejectWithValue}) => {
    try{
        const config ={ 
            headers:{
                "Content-Type": "multipart/form-data",
            },  
            withCredentials:true
        };
        const {data} =await axios.put("/api/v1/profile/update",userData,config);
        return data;
    }catch(error){
        return rejectWithValue(
            error.response?.data || "Profile update failed. try again later."
)}
});

//update password
export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };

            const { data } = await axios.put(
                "/api/v1/password/updatepassword",
                passwordData,
                config
            );

            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//login api
export const login = createAsyncThunk('user/login', async ({email,password},{rejectWithValue}) => {
    try{
        const config ={
            headers:{
                "Content-Type": "application/json",
            },  
        };
        const {data} =await axios.post("/api/v1/login",{email,password},config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || "Login failed. try again later.");
    }
});

//logout
export const logout = createAsyncThunk('user/logout', async (_,{rejectWithValue}) => {
    try{
        
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("wishlistItems");

        return null;
    }catch(error){
        return rejectWithValue(error.response?.data || "Logout failed. try again later.");
    }
});

// Admin: Get all users
export const getAdminUsers = createAsyncThunk('user/getAdminUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/v1/admin/users', { withCredentials: true });
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

// Admin: Update user role
export const updateUserRole = createAsyncThunk('user/updateUserRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`/api/v1/admin/user/${id}`, { role }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
  }
});

// Admin: Delete user
export const deleteAdminUser = createAsyncThunk('user/deleteAdminUser', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/v1/admin/user/${id}`, { withCredentials: true });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
  }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        loading : false,
        error: null,
        success: false,
        isAuthenticated: localStorage.getItem('user') ? true : false,
        message: null,
        users: [],
        isUpdated: false,
        isDeleted: false,
        successMessage: null,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        resetUserStatus: (state) => {
            state.isUpdated = false;
            state.isDeleted = false;
            state.successMessage = null;
        },
        removeSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers:(builder) => {
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            // state.success = true;
            state.user = action.payload?.user|| null;
            state.isAuthenticated = Boolean(action.payload?.user);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
        }).addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Registration failed. try again later.";
            state.user = null;
            state.isAuthenticated = false;
        });


        //login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            // state.success = false;
            state.user = action.payload?.user|| null;
            state.isAuthenticated = Boolean(action.payload?.user);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
        }).addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "login failed. try again later.";
            state.user = null;
            state.isAuthenticated = false;
        });

        //load user
        builder.addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
        }).addCase(loadUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Profile retrieval failed. try again later.";
            state.user = null;
            state.isAuthenticated = false;
            if(action.payload?.statusCode===401){
                state.user=null;
                state.isAuthenticated=false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            }
        }) 

        //logout
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
            state.user = null;
            state.isAuthenticated = false;
            state.success=null;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        }).addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Logout failed. try again later.";
            state.user = null;
            state.isAuthenticated = false;
        });

        //update profile
        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
        }).addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Profile update failed. try again later.";
            state.user = null;
            state.isAuthenticated = false;
        });


        // Update Password
        builder
        .addCase(updatePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        })
        .addCase(updatePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });

        // Forgot Password
        builder
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload.message;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error =
                action.payload?.message || "Failed to send reset link";
        });


        // Reset Password
        builder
        .addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload.message;
            state.user = action.payload.user || null;
            state.isAuthenticated = Boolean(action.payload.user);
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error =
                action.payload?.message || "Password reset failed";
        });

        // Admin: Get all users
        builder
          .addCase(getAdminUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getAdminUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
          })
          .addCase(getAdminUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });

        // Admin: Update user role
        builder
          .addCase(updateUserRole.pending, (state) => {
            state.loading = true;
            state.isUpdated = false;
          })
          .addCase(updateUserRole.fulfilled, (state, action) => {
            state.loading = false;
            state.isUpdated = action.payload.success;
            state.successMessage = action.payload.message || "User role updated successfully";
          })
          .addCase(updateUserRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });

        // Admin: Delete user
        builder
          .addCase(deleteAdminUser.pending, (state) => {
            state.loading = true;
            state.isDeleted = false;
          })
          .addCase(deleteAdminUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isDeleted = action.payload.success;
            state.successMessage = action.payload.message || "User deleted successfully";
          })
          .addCase(deleteAdminUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    },
});



export const { removeErrors, removeSuccess, resetUserStatus } = userSlice.actions;
export default userSlice.reducer;