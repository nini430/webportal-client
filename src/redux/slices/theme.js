import {createSlice} from "@reduxjs/toolkit"

const initialState={
    isLight:true
}

const themeSlice=createSlice({
    name:"theme",
    initialState,
    reducers:{
        changeTheme:(state)=>{
            state.isLight=!state.isLight
        }
    }

})

export const {changeTheme}=themeSlice.actions;
export default themeSlice.reducer;

