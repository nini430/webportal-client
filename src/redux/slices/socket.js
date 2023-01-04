import {createSlice} from "@reduxjs/toolkit"


const initialState={
    socket:null
}
const socketSlice=createSlice({
    name:"socket",
    initialState,
    reducers:{
        getSocket:(state,action)=>{
            state.socket=action.payload;
        }
    }
})

export const {getSocket}=socketSlice.actions;
export default socketSlice.reducer;