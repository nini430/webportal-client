import {createSlice} from "@reduxjs/toolkit"

const initialState={
    searchResults:null
}

const search=createSlice({
    name:"search",
    initialState,
    reducers:{
        getSearchResults:(state,{payload})=>{
            state.searchResults=payload;
        }
    }
})

export const {getSearchResults}=search.actions;
export default search.reducer;