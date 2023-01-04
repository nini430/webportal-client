import React, { useState } from 'react'
import {Form} from "react-bootstrap"
import {useAsyncDebounce} from "react-table"

const GlobalFilterInput = ({filter,setFilter}) => {
    const [value,setValue]=useState(filter);
    const onChange=useAsyncDebounce(value=>{
        setFilter(value||undefined)
    },400)
  return (
    <Form.Control value={value||""} onChange={e=>{
        setValue(e.target.value);
        onChange(e.target.value);
    }}   className='mb-2' type="text" placeholder="Search..."/>
  )
}

export default GlobalFilterInput;