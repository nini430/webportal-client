import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment"
import { Button } from 'react-bootstrap';
import { clearNotifications } from '../redux/slices/notifications';


const Notifications = () => {
    const dispatch=useDispatch();
    const {notifications}=useSelector(state=>state.notification)
  return (
    <div className='position-absolute popover notify d-flex flex-column'>
    <div>
        {notifications.length ? (
            notifications.map(notif=>(
                <div className="notif">
                    <p>Admin {notif.status} Your request</p>
                    <span>{moment(notif.updatedAt).fromNow()}</span>
                    <hr/>
                </div>
            ))
        ):<h1 className='text-center text-small'>Notifications Empty</h1>}
            
    </div>
   {notifications.length ? <Button onClick={()=>dispatch(clearNotifications())} variant="danger" className='align-self-center'>Clear All</Button>:""} 
    </div>
    
  )
}

export default Notifications;