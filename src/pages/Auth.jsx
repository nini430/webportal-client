import React from 'react'
import { AuthForm } from '../components';

import {Tabs,Tab,TabList,TabPanel} from "react-tabs";
import { useDispatch } from 'react-redux';
import { cleanupErrors } from '../redux/slices/auth';

const Auth = ({isRegister}) => {
  const dispatch=useDispatch();
  return (
    <div className='auth'>
     {isRegister ? <AuthForm isRegister/>:(
      <Tabs >
        <TabList onClick={()=>dispatch(cleanupErrors())}>
          <Tab>Sign In As User</Tab>
          <Tab>Sign In As Admin</Tab>
        </TabList>
        <TabPanel>
          <AuthForm/>
        </TabPanel>
        <TabPanel>
          <AuthForm admin={true}/>
        </TabPanel>
      </Tabs>
     )} 
    </div>
  )
}

export default Auth;