import React from 'react'
import {Button, Form, Table} from "react-bootstrap"
import {useTable,usePagination,useRowSelect} from "react-table"
import {ImBlocked} from "react-icons/im"
import {MdDelete} from "react-icons/md"
import {CgUnblock} from "react-icons/cg"
import {useQueryClient,useMutation} from "@tanstack/react-query"

import {SelectCheckbox} from "../components"
import { axiosFetch } from '../axios'

const TableComponent = ({columns,data,users,deleted,admins,refetch}) => {
  const client=useQueryClient();
  const blockOrUnblockMutation=useMutation((body)=>{
      
    return axiosFetch.put(`/admin/block?status=${body.status}`,{userIds:body.userIds},{withCredentials:true})
  },{
    onSuccess:()=>{
      client.invalidateQueries(["users"]);
      if(deleted) refetch();
    }
  })
  const makeAdminOrNonAdminMutation=useMutation((body)=>{
    return axiosFetch.put(`/admin/role/?role=${body.role}`,{userIds:body.userIds},{withCredentials:true})
  },{
    onSuccess:()=>{
      client.invalidateQueries(["users"])
      if(admins) {
        refetch();
      }
    }
  })
  const {getTableProps,getTableBodyProps,page,prepareRow,headerGroups,state,pageOptions,nextPage,previousPage,canNextPage,gotoPage,canPreviousPage,selectedFlatRows}=useTable({columns,data:data||[]},usePagination,useRowSelect,hooks=>
    hooks.visibleColumns.push(columns=>{
      return [
        {
          id:"selection",
          Header:(({getToggleAllRowsSelectedProps})=><SelectCheckbox {...getToggleAllRowsSelectedProps()}/>),
          Cell:({row})=>(<SelectCheckbox {...row.getToggleRowSelectedProps()}/>)
        },
        ...columns
      ]
    }))
  const {pageIndex}=state;
  const userIds=selectedFlatRows.map(item=>item.original.id);
  return (
    <div className='d-flex flex-column align-items-center'>
      {users && (
        <div className="actions align-self-end mb-2 d-flex gap-1">
        <Button onClick={()=>blockOrUnblockMutation.mutate({userIds,status:"blocked"})}><ImBlocked/></Button>
        <Button onClick={()=>blockOrUnblockMutation.mutate({userIds,status:"active"})}><CgUnblock/></Button>
        <Button onClick={()=>blockOrUnblockMutation.mutate({userIds,status:"deleted"})} className='delete'><MdDelete /></Button>
        <Button onClick={()=>makeAdminOrNonAdminMutation.mutate({userIds,role:"admin"})} variant="success">Make Admin</Button>
       
      </div>
      )}

      {deleted && (
        <div className='align-self-end mb-2'>
          <Button onClick={()=>blockOrUnblockMutation.mutate({userIds,status:"active"})}>Reactivate</Button>
        </div>
      )}
      {admins && (
        <div className="align-self-end mb-2">
           <Button onClick={()=>makeAdminOrNonAdminMutation.mutate({userIds,role:"user"})} variant="success">Make Non-Admin</Button>
        </div>
      )}
      
     <Table responsive bordered hovered striped {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup=>(
          <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column=>(
                <th  {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
          </tr>
        ))}
          </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row=>{
                prepareRow(row);
                return (
                  <tr>
                    {row.cells.map(cell=>(
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          
      
    </Table>
    <div className="bottom">
            <div className="d-flex align-items-center">
              <Button disabled={!canPreviousPage} onClick={()=>previousPage()}>Previous</Button>
              <Form.Control type="number" defaultValue={1} onChange={e=>{
                const pageIndex=+e.target.value-1;
                gotoPage(pageIndex);

              }}/>
              <Button disabled={!canNextPage} onClick={()=>nextPage()}>Next</Button>
            </div>
            <p className='text-center mt-3'><strong>{pageIndex+1}</strong> Of {pageOptions.length}</p>
    </div>
   
    </div>
   
  )
}

export default TableComponent;