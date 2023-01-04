import { useQuery } from '@tanstack/react-query';
import React,{useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import { axiosFetch } from '../axios';
import { userColumns } from '../columns';
import TableComponent from './Table';
import {ClipLoader} from "react-spinners"

const DeletedUsers = () => {
  const {currentUser}=useSelector(state=>state.auth);
  const navigate=useNavigate();

  useEffect(()=>{
    if(currentUser.role!=="admin") {
      navigate("/");
    }
  },[currentUser,navigate])
    const {data,isLoading,refetch}=useQuery(["deleted"],()=>{
        return axiosFetch.get('/admin/allusers/?deleted=true',{withCredentials:true})
    })
    if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className='p-5'>
        <h1>Deleted Users</h1>
        <TableComponent refetch={refetch} deleted columns={userColumns} data={data?.data}/>
    </div>
  )
}

export default DeletedUsers;