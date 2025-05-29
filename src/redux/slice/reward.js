import { createSlice } from '@reduxjs/toolkit';

const rewardSlice = createSlice({
    name: 'reward',
    initialState: {
        // Lưu ngày nhận thưởng cho từng mốc, null nếu chưa nhận
        streakRewards: { 7: null, 14: null, 30: null },
    },
    reducers: {
        updateStreakRewards: (state, action) => {
            state.streakRewards = {
                ...state.streakRewards,
                ...action.payload, // payload dạng { 7: "2024-06-01" }
            };
        },
        resetStreakRewards: (state) => {
            state.streakRewards = { 7: null, 14: null, 30: null };
        },
    },
});

export const { updateStreakRewards, resetStreakRewards } = rewardSlice.actions;
export default rewardSlice.reducer;