import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// Check for an existing guest ID in the localStorage or generate a new One
const initialGuestId =
    localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);

            return response.data.user; // Return the user object from the response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for User Login
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);

            return response.data.user; // Return the user object from the response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Auth Slice Definition
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            // Clear user data and generate new guest ID
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;  // Corrected template string syntax
            
            // Update localStorage
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId : (state)=>{
            state.guestId = `guest_${new Date().getTime()}`;  // Corrected template string syntax
            localStorage.setItem("guestId", state.guestId);

        }
    },
    extraReducers: (builder) => {
        builder
            // Handling login pending state
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handling successful login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;  // Sets the user data from the login response
                state.error = null;
            })
            // Handling failed login
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed";  // Error handling with fallback
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handling successful login
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;  // Sets the user data from the login response
                state.error = null;
            })
            // Handling failed login
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login failed";  // Error handling with fallback
            });
    }
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer; 