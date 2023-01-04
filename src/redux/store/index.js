import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"

import {persistStore, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER }from "redux-persist";
import createSagaMiddleware from "redux-saga"

import rootSaga from "../sagas/rootSaga.js";

const sagaMiddleware=createSagaMiddleware();


export const store=configureStore({
    reducer:rootReducer,
    middleware:getDefaultMiddleware=>getDefaultMiddleware({thunk:false,serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,"socket/getSocket"],
        ignoredPaths: ['socket.socket']
     
      },}).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga);

export const persistor=persistStore(store);