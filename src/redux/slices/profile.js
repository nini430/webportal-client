import {createSlice} from "@reduxjs/toolkit"


const initialState={
    userProfile:null
}


const profile=createSlice({
    name:"profile",
    initialState,
    reducers:{
        getUserProfile:(state,action)=>{
            state.userProfile=action.payload;
        }
    }
})


export const {getUserProfile}=profile.actions;
export default profile.reducer;