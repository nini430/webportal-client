import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate} from "react-router-dom"
import {Rating} from "react-simple-star-rating"
import {useSelector,useDispatch} from "react-redux"
import ReactQuill from "react-quill"
import {Image,Form, InputGroup, Button, OverlayTrigger, Tooltip} from "react-bootstrap"
import Slider from "react-slick"
import {FaComments,FaSmileBeam} from "react-icons/fa"
import {FcRating} from "react-icons/fc"
import {AiOutlineComment,AiOutlineHeart,AiFillHeart,AiOutlineEdit,AiOutlineDelete} from "react-icons/ai";
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query"
import { useParams } from 'react-router-dom'
import {useTranslation} from "react-i18next"
import {ToastContainer,toast} from "react-toastify"
import EmojiPicker from "emoji-picker-react"
import {ClipLoader} from "react-spinners"

import {Comment, ReactModal} from '../components'
import { axiosFetch } from '../axios'
import {getReview,getComments,setLastId,clearComments,deleteComment,editComment,reactComment,unreactComment} from "../redux/slices/review"
import { keys } from '../env'
import {DeleteModal} from '../components'
import { toastOptions } from '../utils/toastOptions'




const ReviewDetails = () => {
  const navigate=useNavigate();
  const [modalOpen,setModalOpen]=useState(false);
  const [likeModal,setLikeModal]=useState(false);
  const [rateModal,setRatemodal]=useState(false);
  const client=useQueryClient();
  const {currentReview,lastId,comments}=useSelector(state=>state.review)
  const {socket}=useSelector(state=>state.socket)
  const {currentUser}=useSelector(state=>state.auth)
  const dispatch=useDispatch();
  const {id}=useParams();
  const {t}=useTranslation();
  const [comment,setComment]=useState("");
  const commentRef=useRef();
  const [showEmojiPicker,setShowEmojiPicker]=useState(false);
  const pickerRef=useRef();


 

    
useEffect(()=>{
  const handleClickOutside=e=>{
    if(pickerRef.current && !pickerRef.current.contains(e.target)) {
      setShowEmojiPicker(false);
    }
  }
  document.addEventListener("mousedown",handleClickOutside);
  return ()=>{
    document.removeEventListener("mousedown",handleClickOutside)
  }
},[pickerRef])

const {refetch}=useQuery(["review"],()=>{
    return axiosFetch.get(`/reviews/${id}?userId=${currentUser.uuid}`)
},{
  onSuccess:({data})=>{
    console.log(data);
    dispatch(getReview(data))
    
  },cacheTime:0
})

useEffect(()=>{
  if(socket) {
    socket.on("receive_message",(data)=>{
      console.log("iuhu")
      dispatch(getComments({comments:[data],append:true}))
    })
     
  socket?.on("receive_delete",({id})=>{
    dispatch(deleteComment({id}));
  })
  socket?.on("receive_edit",({id,text})=>{
    dispatch(editComment({id,text}))
  })
  socket?.on("receive_react",({updated,id,data,oldEmoji})=>{
    dispatch(reactComment({id,updated,data,oldEmoji}))
  })

  socket?.on("receive_unreact",({id,userId,oldEmoji})=>{
    dispatch(unreactComment({id,userId,oldEmoji}))
  })
  }

  socket?.on("receive_like",()=>{
    refetch();
  })

  socket?.on("receive_rate",()=>{
    refetch()
  })
 

},[socket,dispatch,refetch])

useEffect(()=>{
  if(commentRef?.current) {
    commentRef?.current.scrollIntoView({behavior:"smooth"});
  }
},[comment])


const fetchComments=async()=>{
  const {data}=await axiosFetch.get(`/comments/${id}?lastId=${lastId}`);
  return data;
}

useEffect(()=>{
  dispatch(clearComments())
  fetchComments().then(data=>{
    dispatch(getComments({comments:data.comments.reverse(),prepend:true}))
    dispatch(setLastId(data.lastId));
  })

},[])



const rateReview=useMutation((rating)=>{
   return axiosFetch.post(`/reviews/rate/${id}`,{rating},{withCredentials:true})
},{
  onSuccess:({data})=>{
    socket?.emit("rate_review",{sender:currentUser.uuid})
    console.log(data);
    client.invalidateQueries(["review"])
  }
})

const likeReview=useMutation(()=>{
    return axiosFetch.put(`/reviews/like/${id}`,{},{withCredentials:true})
},{
  onSuccess:({data})=>{
    socket?.emit("like_review",{sender:currentUser.uuid});
    console.log(data);
    client.invalidateQueries(["review"])
  }
})

const commentReview=useMutation((comment)=>{
     return axiosFetch.post(`/comments/${id}`,{comment},{withCredentials:true})
},{
  onSuccess:({data})=>{
    socket.emit("add_comment",{data,sender:currentUser.uuid});
    setComment("");
    dispatch(getComments({comments:[data],append:true}));
    
    
    
  }
})

const deleteReview=useMutation(()=>{
  return axiosFetch.delete(`/reviews/${id}`,{withCredentials:true})
},{
  onSuccess:({data})=>{
    console.log(data);
    toast.success(data.msg,toastOptions)
    setTimeout(()=>{
      navigate("/")
    })
  }
})

const emojiClickHandler=(emoji)=>{
  let message=comment;
  message+=emoji.emoji;
  setComment(message);
}




  
  if(!currentReview) {
    return <ClipLoader size={150}/>
  }
  if(currentReview) {
    const {review:{reviewName,reviewedPiece,tags,group,reviewText,grade,averageRating,commentsCount,ratingsCount,likesCount,user:{profUpdated,profileImg,firstName,lastName,uuid},reviewImages},ratedUsers,likedUsers}=currentReview;
    const myRating=ratedUsers?.find(user=>user.user.id===currentUser.id)?.rating.rating||0;
    const liked=likedUsers.find(({user})=>user.id===currentUser.id);
    console.log(likedUsers);
  return (
    <div className='reviewDetails'>
      <div className="left">
        <h1 className='mb-4'>{t("review_details")}</h1>
        <p><strong>{t("review_name")}: </strong>{reviewName}</p>
        <hr/>
        <p><strong>{t("reviewed_piece")}: </strong>{reviewedPiece}</p>
        <hr/>
        <p><strong>{t("tags")}: </strong>{tags.split(",").map(item=>`#${item}`).join(",")}</p>
        <hr/>
        <p><strong>{t("group")}: </strong>{group}</p>
        <hr/>
        <strong>{t("review_text")}:</strong>
        <ReactQuill readOnly value={reviewText}/>
        <hr/>
        <p><strong>{t("grade")}: </strong>{grade}</p>
        <hr/>
        <p><OverlayTrigger placement='bottom' overlay={<Tooltip>Click to see who rated it</Tooltip>}><strong onClick={()=>setRatemodal(true)} role="button" className='text-decoration-underline'> {ratingsCount} </strong></OverlayTrigger>People rated it</p>
        <hr/>
        <div className='d-flex gap-1 align-items-center'><strong>{t("created")}: </strong> <Link to={`/profile/${uuid}`} className="link"><div className="user"><img src={profUpdated?profileImg:keys.PF+profileImg} alt="" /><span>{firstName} {lastName}</span></div></Link></div>
        <hr/>
        <p><strong>{t("average_rating")}: </strong> <Rating allowFraction readonly initialValue={averageRating}/></p>
        <hr/>

        
      </div>
      <div className="right">
        <div className="center">
        <Slider autoplay autoplaySpeed={2000} slidesToShow={1}>
          {reviewImages.map(({img,isDefault})=>(
              <Image thumbnail key={img} src={isDefault?keys.PF+img:img} alt=""/>
          ))}</Slider>
        </div>
       
        <div ref={commentRef} className="commSection">
        <div  className=" d-flex gap-2 align-items-center">
        {likesCount!==0 && <OverlayTrigger placement="bottom" overlay={<Tooltip>Click to see who liked this post</Tooltip>}><span className='d-flex align-items-center' onClick={()=>setLikeModal(true)} role="button">{likesCount}</span></OverlayTrigger>} {liked? <AiFillHeart onClick={()=>likeReview.mutate()} role="button" size={20}/> : <AiOutlineHeart onClick={()=>likeReview.mutate()} role="button"  size={20}/>}   
          <span className='d-flex align-items-center' >{commentsCount}</span> <AiOutlineComment role="button"  size={20}/>
        </div>
        <hr/>
        <div ref={commentRef}  className="comments">
                    
         {commentsCount!==comments.length &&  <Button variant='link' onClick={fetchComments}>View Previous comments</Button>} 
         {comments.length ? comments.map(({comment,users},index)=>(
           <div ref={index===comments.length-1?commentRef:null}  key={comment.id}><Comment socket={socket}  comment={{comment,users,reacts:Array.from(new Set(users.map(user=>user.reaction.emoji)))}}/></div>
  )):<h1 className='text-center'>No Comments</h1>}
          
        </div>
        <hr/>
        <div className="addComment">
          <div className="user">
            <img src={currentUser.profUpdated?currentUser.profileImg:keys.PF+currentUser.profileImg} alt="" />
            <InputGroup>
            <div ref={pickerRef} className="smile">
              <FaSmileBeam onClick={()=>setShowEmojiPicker(!showEmojiPicker)} role="button" size={35}/>
            {showEmojiPicker && <div className="picker"><EmojiPicker   onEmojiClick={emojiClickHandler}  theme="light" /></div> } 
            </div>
           
            <Form.Control value={comment} onChange={e=>setComment(e.target.value)} placeholder='Add a Comment...' type="text" />
            <Button onClick={()=>commentReview.mutate(comment)} type="submit">{t("send")}</Button>
            </InputGroup>

            
           
          </div>
        </div>

        </div>
      
        

        <div className="reacts d-flex justify-content-between w-100 mt-2">
          <div className=" d-flex align-items-center gap-3">
            {likesCount!==0 && <OverlayTrigger  placement="bottom" overlay={<Tooltip>Click to See who liked this review</Tooltip>}><span  onClick={()=>setLikeModal(true)} role="button" className='text-decoration-underline'>{likesCount}</span></OverlayTrigger>} {liked ? <AiFillHeart color="red" onClick={()=>likeReview.mutate()} role="button" size={40}/>  : <AiOutlineHeart  className='heartIcon' onClick={()=>likeReview.mutate()} role="button" size={40} /> }
            <span>{commentsCount} <AiOutlineComment  size={40}/></span>
          </div>
         {currentUser && <Rating allowFraction initialValue={myRating} onClick={(rating)=>rateReview.mutate(rating)}/> } 
          <div className="d-flex">
            <Link className='link' to={`/update/${id}`}><AiOutlineEdit  role="button" size={40}/></Link>
            <AiOutlineDelete onClick={()=>setModalOpen(true)} role="button" size={40}/>
          </div>
        </div>
       
      </div>
      
      <ToastContainer/>
      {rateModal && <ReactModal users={ratedUsers} reacts={[<FcRating/>]} rate isModalOpen={rateModal} close={()=>setRatemodal(false)} totalReacts={ratingsCount} text="Rated"/>}
      {likeModal && <ReactModal users={likedUsers} reacts={[<AiFillHeart color="red"/>]} like isModalOpen={likeModal} close={()=>setLikeModal(false)} totalReacts={likesCount} text="Liked"/>}
      {modalOpen && <DeleteModal subject={t("review")} modalOpen={modalOpen} close={()=>setModalOpen(false)} deleteSubject={deleteReview}  />}
    </div>
  )
  }
}

export default ReviewDetails