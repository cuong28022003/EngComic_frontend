import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentStreak: 0,
    longestStreak: 0,
    userDiamonds: 0,
    streakRewards: {
        7: false,
        17: false,
        30: false,
    },
};

const userStatsSlice = createSlice({
    name: 'userStats',
    initialState,
    reducers: {
        setStreak(state, action) {
            state.currentStreak = action.payload.currentStreak;
            state.longestStreak = action.payload.longestStreak;
        },
        setDiamonds(state, action) {
            state.userDiamonds = action.payload;
        },
        setReward(state, action) {
            const { milestone, received } = action.payload;
            state.streakRewards[milestone] = received;
        },
    },
});

export const { setStreak, setDiamonds, setReward } = userStatsSlice.actions;
export default userStatsSlice.reducer;