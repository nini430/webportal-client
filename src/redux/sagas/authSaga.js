import {all,take,call,put,fork} from "redux-saga/effects";

import {authStart,authSuccess,authError} from "../slices/auth"
import { loginUser } from "../../utils/api";


function* login(payload) {
    try {
    const response=yield call(loginUser,payload);
    yield put(authSuccess(response.data))
    }catch(err) {
        if(err.response?.data) {
            yield put(authError(err.response.data));
        }
        
    }
}

function* authWatcher() {
    while(true) {
        const {payload}=yield take(authStart);
        yield fork(login,payload)
    }
}


export default function* authSaga() {
    yield all([authWatcher()])
}


