import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import UserAPI, { LoginParams } from '../../API/userAPI';

export const login = createAsyncThunk("loginFetch", async (params: LoginParams) => {
    const response = await UserAPI.login(params)
    localStorage.setItem("accessToken", response.data.accessToken)
    localStorage.setItem("userLogin", JSON.stringify(response.data.user))
    return response.data
})

// Initial state
const initialState = {
    user: null,
    isLoggedIn: false,
    error: null,
};
const loginFulfilled = `${login}/fulfilled`;

// Create slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: {
        [loginFulfilled]: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        }
    }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { actions, reducer } = userSlice;

export default reducer;