
import React,{useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {Image,Button, OverlayTrigger, Tooltip} from "react-bootstrap"
import {RxCross2} from "react-icons/rx"
import {MdDone} from "react-icons/md"
import {ClipLoader} from "react-spinners"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import {keys} from "../env"
import {axiosFetch} from "../axios"
import { getRequests } from '../redux/slices/requests'


const Requests = () => {
  const client=useQueryClient();
  const dispatch=useDispatch();
  const {currentUser}=useSelector(state=>state.auth);
  const {requests}=useSelector(state=>state.request);
  const {socket}=useSelector(state=>state.socket)
  const navigate=useNavigate();

  useEffect(()=>{
    if(currentUser.role!=="admin") {
      navigate("/")
    }
  },[currentUser,navigate])

  const {isLoading}=useQuery(["requests"],()=>{
    return axiosFetch.get('/admin/requests',{withCredentials:true})
  },{
    onSuccess:({data})=>{
        dispatch(getRequests(data));
    }
  })
  let user;
  const declineRequestMutation=useMutation((userId)=>{
      user=userId;
      return axiosFetch.put(`/admin/decline/${userId}`,{},{withCredentials:true})
  },{
    onSuccess:()=>{
        socket?.emit("decline_request",{recipient:user});
        client.invalidateQueries(["requests"])
    }
  })

  if(isLoading) return <div className="p-5"><ClipLoader size={150}/></div>
  
  if(!requests.length) return <div className="p-5"><h1>No Requests So far</h1></div>
  return (
    <div className='requestPage p-5 d-flex flex-column gap-3'>
      <h1>Admin Requests</h1>
      {requests.map(item=>{
      return (
        <>
        <div className='request  d-flex  align-items-center'>
          <div className="candidate">
            <Image thumbnail rounded src={item.user.profUpdated?item.user.profileImg:keys.PF+item.user.profileImg}/>
            <span>{item.user.firstName} {item.user.lastName}</span>
          </div>
          <div className="icons">
           
           <OverlayTrigger placement="bottom" overlay={<Tooltip>Accept</Tooltip>}>
           <Button><MdDone role="button" color="limegreen"/></Button>
           </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Decline</Tooltip>}>
          <Button onClick={()=>declineRequestMutation.mutate(item.user.uuid)}><RxCross2 role="button" color="orangered"/></Button> 
            </OverlayTrigger> 
          </div>
          

        </div>
        <hr/>
        </>
        
      ) 
      })}
    </div>
  )
}

export default Requests