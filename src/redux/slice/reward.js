import { createSlice } from '@reduxjs/toolkit';

const rewardSlice = createSlice({
    name: 'reward',
    initialState: {
        streakRewards: { 7: false, 14: false, 30: false },
    },
    reducers: {
        updateStreakRewards: (state, action) => {
            state.streakRewards = {
                ...state.streakRewards,
                ...action.payload, // Ghi đè trạng thái mới cho các mốc streak
            };
        },
    },
});

export const { updateStreakRewards } = rewardSlice.actions;
export default rewardSlice.reducer;