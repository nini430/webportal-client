import React, { useState } from 'react'
import {Image,Form, Button} from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import {useMutation} from "@tanstack/react-query"
import {toast,ToastContainer} from "react-toastify"
import {ClipLoader} from "react-spinners"

import { keys } from '../env';
import { axiosFetch } from '../axios';
import { toastOptions } from '../utils/toastOptions'
import { addBio } from '../redux/slices/auth'

const Bio = () => {
    const dispatch=useDispatch();
    const [bio,setBio]=useState("")
    const {currentUser}=useSelector(state=>state.auth);
    const {mutate,isLoading}=useMutation((bio)=>{
        return axiosFetch.post("/user/add",{bio},{withCredentials:true})
    },{
        onSuccess:(({data})=>{
            dispatch(addBio(bio));
            setBio("")
            toast.success(data.msg,toastOptions);
            
        })
    })
    if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className="bio d-flex gap-3">
        <Image thumbnail src={currentUser.profUpdated?currentUser.profileImg:keys.PF+currentUser.profileImg} alt=""/>
        <Form onSubmit={e=>e.preventDefault()}>
            <Form.Control onChange={e=>setBio(e.target.value)} value={bio} className='mb-1' as="textarea" placeholder={` ${currentUser.firstName},You can add your bio`}/>
            <Button onClick={()=>mutate(bio)}  type="submit">Post</Button>
        </Form>
        <ToastContainer/>
    </div>
  )
}

export default Bio