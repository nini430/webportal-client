import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import {TiEdit} from "react-icons/ti"
import { useDispatch, useSelector } from 'react-redux';
import { axiosFetch } from '../axios';
import { getUser } from '../redux/slices/auth';
import UpdatePasswordModal from './UpdatePasswordModal';


const Parameter = ({label,accessor,value,isPassword}) => {
  const {currentUser}=useSelector(state=>state.auth);
  const [modalOpen,setModalOpen]=useState(false);
  const [updatedValue,setUpdatedValue]=useState(value);
  const dispatch=useDispatch();
  const [inEditMode,setInEditMode]=useState(false);
  const cancelHandler=()=>{
    setUpdatedValue(value);
    setInEditMode(false);
  }
  const updateMutation=useMutation((updates)=>{
    return axiosFetch.put(`/user/${currentUser.uuid}/?personal=true`,updates,{withCredentials:true})
  },{
    onSuccess:(({data})=>{
        dispatch(getUser(data));
        setInEditMode(false);
    })
  })
  return (
    <>
    <p><strong>{label}: </strong> {inEditMode? <Form.Control onChange={e=>setUpdatedValue(e.target.value)} type="text" value={updatedValue}/>:value}
   {!inEditMode? <TiEdit onClick={isPassword?()=>setModalOpen(true):()=>setInEditMode(true)} role="button" size={25}/> : <ButtonGroup><Button onClick={()=>updateMutation.mutate({[accessor]:updatedValue})} variant="success">Save</Button><Button onClick={cancelHandler} variant="secondary">Cancel</Button></ButtonGroup> } 
    </p>
    {modalOpen && <UpdatePasswordModal show={modalOpen} close={()=>setModalOpen(false)}/>}
    </>
   
  )
}

export default Parameter