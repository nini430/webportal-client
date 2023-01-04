import React from 'react'
import { Form } from 'react-bootstrap';

const ColumnFilterInput = ({column}) => {
  const {filterValue,setFilter}=column;
  return (
    <Form.Control type="text" value={filterValue||""} onChange={e=>setFilter(e.target.value)}/>
  )
}

export default ColumnFilterInput;