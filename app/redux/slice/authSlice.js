import { LocalServer } from "@/app/utils";
import { getErrorMessage } from "@/app/utils/helper";
import ToastNotification from "@/app/utils/Toast";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const { ToastComponent } = ToastNotification;

export const loginUser = createAsyncThunk(
  "login/userLogin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LocalServer.post("/api/signin", userData);
      if (response?.data?.success) {
        return response.data;
      } else {
        ToastComponent("error", response?.data?.message);
      }
    } catch (error) {
      ToastComponent("error", getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create a logout action to clear the user state
export const logoutUser = createAsyncThunk(
  "login/userLogout",
  async (_, { dispatch }) => {
    // Optionally, you can perform an API call here for logout if needed.
    // For example, calling an API to log the user out from the server-side.

    // Clear local storage or any persisted data (optional)
    localStorage.removeItem("persist:auth"); // If using redux-persist

    // Dispatch the logout action
    dispatch(resetAuthState());
    // ToastComponent("success", "Logged out successfully!");
  }
);

export const updateUser = createAsyncThunk(
  "login/updateUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const response = await LocalServer.get(
        `/api/user/listing?page=1&view=20&search=&sortBy=created_at&orderBy=desc`
      );
      if (response?.data?.success) {
        //console.log('----------------------', response)
        // ToastComponent("success", "User updated successfully!");
        dispatch(updateUserInfo(response.data));
        return response.data;
      } else {
        ToastComponent("error", response?.data?.message);
        return rejectWithValue(response?.data?.message);
      }
    } catch (error) {
      ToastComponent("error", getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "login",
  initialState: {
    user: null,
    loading: false,
    error: null,
    Tfa: false,
    message: "",
    auth_type: "",
    available_channels: [],
    try_another_way: false,
  },
  reducers: {
    // Reducer to reset state when logging out
    resetAuthState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    updateUserInfo: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          user: {
            ...state.user.user,
            business_name: action.payload.business.name,
            name: action.payload.provider.name,
            image: action.payload.business?.image,
          },
        };
      }
    },

    updateUserLocally: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user, // Preserve existing data
          ...action.payload, // Merge new data directly
        };
      } else {
        state.user = action.payload; // If user is null, initialize it
        state.message = action.payload?.message; // If user is null, initialize it
      }
      // state = action.payload;
    },

    // updateUserInfo: (state, action) => {
    //   console.log("action", action);
    //   if (state.user) {
    //     state.user.user.business_name = action.payload.business.name;
    //     state.user.user.name = action.payload.provider.name;
    //     state.user.user.image = action.payload.business?.logo;
    //   }
    // },
    // updateUserInfo: (state, action) => {
    //   if (state.user) {
    //     state.user.user.business_name = action.payload.name;
    //     state.user.user.name = action.payload.provider_name;
    //     state.user.user.image = action.payload.logo;
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload["2fa"] === true ? null : action.payload;
        state.Tfa = action.payload["2fa"];
        state.message = action.payload?.message;
        state.auth_type = action.payload?.verified_through;
        state.available_channels = action.payload?.available_channels;
        state.try_another_way = action.payload?.try_another_way;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.Tfa = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.Tfa = false;
        state.message = "";
        state.auth_type = "";
        state.available_channels = [];
        state.try_another_way = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          user: { ...state.user.user },
          // user: { ...state.user.user, ...action.payload },
        };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthState, updateUserInfo, updateUserLocally } =
  authSlice.actions;

export default authSlice.reducer;
