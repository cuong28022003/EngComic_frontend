// redux/slice/characterSelection.js
import { createSlice } from '@reduxjs/toolkit';

const characterSelectionSlice = createSlice({
    name: 'characterSelection',
    initialState: {
        selectedCharacters: [] // Array of CharacterCard
    },
    reducers: {
        setSelectedCharacters: (state, action) => {
            state.selectedCharacters = action.payload;
        }
    }
});

export const { setSelectedCharacters } = characterSelectionSlice.actions;
export default characterSelectionSlice.reducer;
