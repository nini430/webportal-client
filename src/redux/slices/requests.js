import {createSlice} from "@reduxjs/toolkit"


const initialState={
    requests:[],
    requestCount:0
}
const requestSlice=createSlice({
    name:"request",
    initialState,
    reducers:{
        getRequests:(state,action)=>{
            state.requests=action.payload;
            state.requestCount=action.payload.length
        },
        addCount:(state)=>{
            state.requestCount=state.requestCount+1
        }
    }
})
export const {getRequests,addCount}=requestSlice.actions;
export default requestSlice.reducer;

