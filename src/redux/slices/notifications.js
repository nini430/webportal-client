import {createSlice} from "@reduxjs/toolkit"


const initialState={
    notifications:[]
}


const notificationsSlice=createSlice({
    name:"notifications",
    initialState,
    reducers :{
        addNotification:(state,action)=>{
            console.log(action.payload);
            state.notifications=[...state.notifications,action.payload]
        },
        clearNotifications:(state,action)=>{
            state.notifications=[];
        }
    }
})

export const {addNotification,clearNotifications}=notificationsSlice.actions;

export default notificationsSlice.reducer;

