// src/redux/userStatsSlice.js
import { createSlice} from '@reduxjs/toolkit';

const userStatsSlice = createSlice({
    name: 'userStats',
    initialState: {
        data: null,
        status: 'idle', // 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        updateUserStats: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { updateUserStats } = userStatsSlice.actions;
export default userStatsSlice.reducer;
