import React, { useMemo, useState } from 'react'
import {useSelector,useDispatch} from "react-redux"
import { Link, useParams} from "react-router-dom"
import {Image,Button, Table,Form} from "react-bootstrap"
import {useMutation, useQuery,useQueryClient} from "@tanstack/react-query"
import {axiosFetch} from ".././axios"
import { getUserProfile } from '../redux/slices/profile'
import {ClipLoader} from "react-spinners"
import moment from "moment"
import Slider from "react-slick"
import {TiArrowSortedDown,TiArrowSortedUp,TiArrowUnsorted,TiEdit} from "react-icons/ti"
import axios from "axios"

import {keys} from "../env"
import {COLUMNS} from "../columns"
import { useTranslation } from 'react-i18next'
import { ColumnFilterInput, GlobalFilterInput } from '../components'
import { TableComponent } from '../components'


const Profile = () => {
 
    const client=useQueryClient();
  const {userProfile}=useSelector(state=>state.profile);

  const [inEditMode,setInEditMode]=useState(false);
  const [text,setText]=useState(userProfile?.bio||"");
  const [file,setFile]=useState(null)
  const {t}=useTranslation();

 
  const columns=useMemo(()=>COLUMNS,[]);
  const data=userProfile?.reviews||[];
  const defaultColumn=useMemo(()=>{
    return {Filter:ColumnFilterInput}
  },[])
 
  

  const dispatch=useDispatch();
  const {userId}=useParams()
 

  const upload=async()=>{
    const formData=new FormData();
    formData.append("file",file);
    formData.append("upload_preset",keys.UPLOAD_PRESET)
    const response=await axios.post(`https://api.cloudinary.com/v1_1/${keys.MY_CLOUD_NAME}/image/upload`,formData);
    return response.data.secure_url;

  }
  
  useQuery(["profile"],()=>{
    return axiosFetch.get(`/user/${userId}`);
  },
  {
    onSuccess:({data})=>{
        dispatch(getUserProfile(data))
        setText(data.bio);
    }
  }
  )

  const {isLoading,mutate}=useMutation(async(updates)=>{
    let img=userProfile.profileImg;
    if(file) {
      img=await upload();
    }
    return axiosFetch.put(`/user/${userId}`,{...updates,profileImg:img},{withCredentials:true})
  },{
    onSuccess:(({data})=>{
      console.log(data);
      client.invalidateQueries(["profile"])
      setInEditMode(false);
      
    })
  })  
 
 
  if(!userProfile) return <ClipLoader size={150}/>
  
  const {firstName,lastName,profileImg,profUpdated,email,createdAt,numberOfReviews,reviews,ratingNumber,bio}=userProfile;
  
  return (
    <div className="profile">
      <div className="left">
        <div className="leftTop d-flex flex-column gap-3">
          <h1>{firstName} {lastName}</h1>
         {isLoading ? <ClipLoader size={80}/>: <Image thumbnail="true" src={file?URL.createObjectURL(file):profUpdated? profileImg:keys.PF+profileImg}/>}
          {inEditMode && <Form.Control onChange={e=>setFile(e.target.files[0])} id="profile" type="file"/>}
          <p><strong>Number Of Reviews: </strong>{numberOfReviews}</p>
        
          <p><strong>Rating Number: </strong>{ratingNumber}</p>
        
          <p><strong>Email: </strong>{email}</p>
          <div className='d-flex gap-2'><strong>Bio: </strong>
          {isLoading? <ClipLoader size={40}/>:inEditMode? <Form.Control onChange={e=>setText(e.target.value)} value={text} as="textarea"/>: <div className="bio">{bio?bio:"No Bio"}</div>}  
          </div>
          <p><strong>Member since: </strong>{moment(createdAt).format("L")}</p>
          <Button onClick={inEditMode?()=>mutate({bio:text}):()=>setInEditMode(true)} className='d-flex align-items-center gap-1 justify-content-center'>{inEditMode?"Save":<><TiEdit size={20}/>Update</>}</Button>
         
        </div>

        <div className="leftBottom">
        <h1>{firstName}'s Recent Reviews</h1>
          <div className="myReviews">
          {reviews.slice(0,2).map(review=>(
              <Link to={`/review/${review.uuid}`} className='link' key={review.id}>
              <div className="mini-review">
                  <h4 className='text-center'>{review.reviewName}</h4>
                  <Slider className='mini-slider' autoplay autoplaySpeed={2000}>
                    {review.reviewImages.map(img=>(
                      <img thumbnail src={img.isDefault?keys.PF+img.img:img.img} alt=""/>
                    ))}
                  </Slider>
                  <p className='mt-2'><strong>Name:</strong> {review.reviewName}</p>
                  <p className='mt-2'><strong>Average Rating:</strong> {review.averageRating}</p>
              </div>
              </Link>
            ))}
          </div>
         
           
        </div>
     
       
      </div>
      <div className="right">
        <h1>{userProfile?.firstName}'s Reviews</h1>
        <hr/>
        <TableComponent data={userProfile?.reviews} columns={COLUMNS}/>
        </div>
       
   
    </div>
  )
}

export default Profile;