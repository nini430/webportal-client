import {combineReducers} from "@reduxjs/toolkit"
import {persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"


import themeReducer from "../slices/theme"
import authReducer from "../slices/auth"
import reviewReducer from "../slices/review"
import profileReducer from "../slices/profile"
import searchReducer from "../slices/search"
import requestReducer from "../slices/requests"
import notificationReducer from "../slices/notifications"
import socketReducer from "../slices/socket"




const themeConfig={
    key:"theme",
    storage
}
const authConfig={
    key:"auth",
    storage,
    whitelist:["currentUser"]
}

const notificationConfig={
    key:"notification",
    storage,
    
}




const rootReducer=combineReducers({
    theme:persistReducer(themeConfig,themeReducer),
    auth:persistReducer(authConfig,authReducer),
    review:reviewReducer,
    profile:profileReducer,
    search:searchReducer,
    request:requestReducer,
    notification:persistReducer(notificationConfig,notificationReducer),
    socket:socketReducer
    

})

export default rootReducer;