
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import {RiAdminFill} from "react-icons/ri"
import { Parameter } from '../components';
import {Button} from "react-bootstrap"
import { useMutation } from '@tanstack/react-query';
import { axiosFetch } from '../axios';

import {ToastContainer,toast} from "react-toastify"
import { toastOptions } from '../utils/toastOptions';

const Settings = () => {
    const {currentUser}=useSelector(state=>state.auth);
    const {socket}=useSelector(state=>state.socket);

    const requestMutation=useMutation(()=>{
      return axiosFetch.post("/user/request",{},{withCredentials:true})
    },{
      onSuccess:({data})=>{
        socket.emit("request_admin",{sender:currentUser.uuid})
        toast.success(data.msg,toastOptions)
      },
      onError:(err)=>{
        toast.error(err.response.data.msg,toastOptions)
      }
    })
    
   
  return (
   <div className="settings">
    <Button disabled={currentUser.request} onClick={()=>requestMutation.mutate()} className="adminBtn">Request To Be An Admin <RiAdminFill/></Button>
    <h1>Update Your Personal Info</h1>
      <div className="attributes">
        <Parameter label="First Name" accessor="firstName" value={currentUser.firstName}  />
        <Parameter label="Last Name" accessor="lastName" value={currentUser.lastName}  />
        {!currentUser.withSocials && <Parameter label="Password" accessor="password" value="*******" isPassword  /> }
      </div>
      <ToastContainer/>
   </div>
  )
}

export default Settings;