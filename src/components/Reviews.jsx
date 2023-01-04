import {useQuery} from "@tanstack/react-query"
import {ClipLoader} from "react-spinners"
import React,{useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import {axiosFetch} from ".././axios"
import {TableComponent} from "../components"
import {adminReviewColumns} from "../columns"

const Reviews = () => {
  const {currentUser}=useSelector(state=>state.auth);
  const navigate=useNavigate();

  useEffect(()=>{
    if(currentUser.role!=="admin") {
      navigate("/")
    }
  },[currentUser,navigate])
  const {isLoading,data}=useQuery(["allReviews"],()=>{
    return axiosFetch.get("/reviews/all",{withCredentials:true})
  })
  if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className="p-5">
      <h1>List Of Reviews</h1>
      <TableComponent reviews data={data?.data} columns={adminReviewColumns}/>
    </div>
   
  )
}

export default Reviews