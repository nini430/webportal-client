import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Image,Nav,Button} from "react-bootstrap"
import { keys } from '../env';
import { Link } from 'react-router-dom';
import { addCount } from '../redux/slices/requests';

const SideBar = () => {
    const {currentUser}=useSelector(state=>state.auth);
    const {requestCount}=useSelector(state=>state.request)
    const {socket}=useSelector(state=>state.socket)
    const dispatch=useDispatch();
    useEffect(()=>{
        if(currentUser.role==="admin") {
            socket?.on("receive_request",()=>{
                dispatch(addCount())
            })
        }
       
    },[dispatch,socket,currentUser])
  return (
    <div className='sidebar d-flex flex-column align-items-center'>
        <div className="adminProfile d-flex flex-column align-items-center">
            <Image thumbnail rounded src={keys.PF+currentUser.profileImg} alt="" />
            <p>{currentUser.firstName} {currentUser.lastName}</p>
        </div>
        <hr/>
        <Nav>
            <Link to="/admin/users" className='link p-3 border-bottom w-100'>users</Link>
            <Link to="/admin/reviews"  className='link p-3 border-bottom w-100' >
                Reviews
            </Link>
            <Link to="/admin/admins"  className='link p-3 border-bottom w-100' >
                Admins
            </Link>
            <Link to="/admin/requests" className='link p-3 position-relative border-bottom w-100' >
               Requests
              {requestCount!==0 && <div className="requests position-absolute d-flex justify-content-center align-items-center">{requestCount}</div> } 
            </Link>
            <Link to="/admin/deleted" className='link p-3 border-bottom w-100' >
               Deleted Users
              
            </Link>
            
        </Nav>
        <Button >Log Out</Button>

        
    </div>
  )
}

export default SideBar