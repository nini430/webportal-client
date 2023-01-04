
import {axiosFetch} from "../axios"

export const loginUser=(body)=>{
    return axiosFetch.post("/auth/login",body,{withCredentials:true});
}

