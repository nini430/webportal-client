import { useQuery } from '@tanstack/react-query'
import React,{useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import { useSelector } from 'react-redux'
import { axiosFetch } from '../axios'
import {ClipLoader} from "react-spinners"
import {TableComponent} from '../components'
import { userColumns } from '../columns'

const Admins = () => {
  const {currentUser}=useSelector(state=>state.auth);
  const navigate=useNavigate();

  useEffect(()=>{
    if(currentUser.role!=="admin") {
      navigate("/")
    }
  },[currentUser,navigate])
    const {isLoading,data,refetch}=useQuery(["admins"],()=>{
        return axiosFetch.get("/admin/allusers/?role=admin",{withCredentials:true},)
    })
    if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className='p-5'>
       <h1>List Of Admins (Other than you)</h1> 
       <TableComponent refetch={refetch} admins data={data?.data} columns={userColumns}/>
    </div>
  )
}

export default Admins