// redux/slice/characterSelection.js
import { createSlice } from '@reduxjs/toolkit';

const characterSlice = createSlice({
    name: 'character',
    initialState: {
        selectedCharacters: [], // Array of CharacterCard
        activeSkills: [] // Array of active skills
    },
    reducers: {
        setSelectedCharacters: (state, action) => {
            state.selectedCharacters = action.payload;
        },
        setActiveSkills: (state, action) => {
            state.activeSkills = action.payload;
        }
    }
});

export const { setSelectedCharacters, setActiveSkills } = characterSlice.actions;
export default characterSlice.reducer;
