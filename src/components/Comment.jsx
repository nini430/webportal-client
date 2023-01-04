import React,{useEffect, useState} from 'react'
import {CgMoreVertical} from "react-icons/cg"
import {Button, Dropdown, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap"
import moment from "moment"
import { useTranslation } from 'react-i18next'
import {useMutation,useQueryClient} from "@tanstack/react-query"
import {AnimateKeyframes} from "react-simple-animate"


import { keys } from '../env'
import { axiosFetch } from '../axios'
import { Link, useParams } from 'react-router-dom'
import { ReactReduxContext, useDispatch, useSelector } from 'react-redux'
import { deleteComment, editComment, getComments,reactComment,unreactComment } from '../redux/slices/review'
import {DeleteModal, ReactModal} from '../components'
import {getReaction, reactions} from "../utils/reactions"
import { BiCommentError } from 'react-icons/bi'





const Comment = ({comment:{comment,users,reacts},socket}) => {
  const [pause,setPause]=useState(false);
  const {currentUser}=useSelector(state=>state.auth);
  const {comments}=useSelector(state=>state.review);
  const [showReactions,setShowReactions]=useState(false);
  const [updatedComment,setUpdatedComment]=useState(comment?.comment)
  const [isEditMode,setIsEditMode]=useState(false);
  const {t}=useTranslation()
  const [modalOpen,setModalOpen]=useState(false);
  const [reactedModal,setReactedModal]=useState(false);
  const {id}=useParams()
  const dispatch=useDispatch();
  const reacted=users.find(user=>user?.user.id===currentUser.id)?.reaction.emoji;
  





  const deleteCommentMutation=useMutation(()=>{
      return axiosFetch.delete(`/comments/${id}/${comment?.uuid}`,{withCredentials:true})
  },{
    onSuccess:(data)=>{
      socket.current?.emit("delete_comment",{id:comment.commentId,sender:currentUser.uuid});
      dispatch(deleteComment({id:comment.commentId}))
      setModalOpen(false);
    }
  })
  const cancelHandler=()=>{
    setUpdatedComment(comment?.comment);
    setIsEditMode(false);
  }

  const editCommentMutation=useMutation((updatedComment)=>{
      return axiosFetch.put(`/comments/${id}/${comment.uuid}`,{updatedComment},{withCredentials:true})
  },{
    onSuccess:({data})=>{
      socket.current?.emit("edit_comment",{id:comment.commentId,text:data.text,sender:currentUser.uuid})
      dispatch(editComment({id:comment.commentId,text:data.text}));
      setIsEditMode(false);
    }
  })

  const reactCommentMutation=useMutation((emoji)=>{
    return axiosFetch.post(`/comments/react/${id}/${comment.uuid}`,{emoji},{withCredentials:true})
  },{
    onSuccess:({data})=>{
      socket.current?.emit("react_comment",{data:{updated:data.updated,id:comment.commentId,data:data.user,oldEmoji:data.oldEmoji},sender:currentUser.uuid})
      console.log(data);
      dispatch(reactComment({updated:data.updated,id:comment.commentId,data:data.user,oldEmoji:data.oldEmoji}))
    }
  })

  const unreactCommentMutation=useMutation(()=>{
    return axiosFetch.delete(`/comments/unreact/${id}/${comment.uuid}`,{withCredentials:true})

  },{
    onSuccess:({data})=>{
      socket.current?.emit("unreact_comment",{id:comment.commentId,userId:currentUser.id,oldEmoji:data.oldEmoji})
      dispatch(unreactComment({id:comment.commentId,userId:currentUser.id,oldEmoji:data.oldEmoji}))
    }
  })
  return (
    <div className='comment'>
       <Link className='link' to={`/profile/${comment.user.uuid}`}><div className="user">
        
        <img src={comment?.user.profUpdated?comment.user.profileImg:keys.PF+comment.user.profileImg} alt="" />
          <span>{comment?.user.firstName} {comment?.user.lastName}</span>
     
        
         
      </div></Link> 
       {!isEditMode ? (<div className="d-flex flex-column">
      <p>{comment?.comment}</p>
          <div className="d-flex gap-1">
            <div onMouseLeave={()=>setShowReactions(false)} className="like">
           {showReactions && <div  className="reactions">
              {reactions.map(emoji=>(
                <AnimateKeyframes pause={pause} iterationCount="infinite" play duration={1.5} keyframes={["transform:rotateY(-45deg)","transform:rotateY(90deg)"]}><div onClick={()=>reactCommentMutation.mutate(emoji.name)} onMouseLeave={()=>setPause(false)} onMouseOver={()=>setPause(true)} className='emoji' role="button">{emoji.emoji}</div></AnimateKeyframes>
              ))}
            </div> } 
          <Button onClick={reacted?()=>unreactCommentMutation.mutate():""} onMouseOver={()=>setShowReactions(true)} className={`react ${reacted}`}  variant="link">{reacted?reacted.charAt(0).toUpperCase()+reacted.substring(1,reacted.length):"Like"}</Button>
            </div>
              <div className="totalEmojis">
                  {comment.totalEmojiCount>0 && <OverlayTrigger placement='bottom' overlay={<Tooltip>Click to see who reacted</Tooltip>}><span onClick={()=>setReactedModal(true)} className='text-decoration-underline' role="button">{comment.totalEmojiCount}</span></OverlayTrigger>}
                  {reacts.map(item=>getReaction(item))}
                  
              </div>
          {currentUser.id===comment.user.id && <Button onClick={()=>setIsEditMode(true)} variant="link">Edit</Button> }
          </div>
        </div>):(
          <InputGroup>
          <Form.Control type="text" value={updatedComment} onChange={e=>setUpdatedComment(e.target.value)} />
          <Button onClick={()=>editCommentMutation.mutate(updatedComment)} >Save</Button>
          <Button variant="secondary" onClick={cancelHandler}>Cancel</Button>
          </InputGroup>
          
        )} 
        <span>{moment(comment?.createdAt).fromNow(true)}</span>
        
        <div className="more">
        <Dropdown>
          <Dropdown.Toggle><CgMoreVertical size={20}/></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={()=>setModalOpen(true)}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>
          
        {reactedModal && <ReactModal subject={comment} reactionProp reacts={reacts.map(item=>getReaction(item))} users={users} totalReacts={comment.totalEmojiCount}  isModalOpen={reactedModal} close={()=>setReactedModal(false)} text="Reacted"/>}
        {modalOpen && <DeleteModal subject={t("comment")} deleteSubject={deleteCommentMutation} modalOpen={modalOpen} close={()=>setModalOpen(false)}/>}
       
    </div>
  )
}

export default Comment;