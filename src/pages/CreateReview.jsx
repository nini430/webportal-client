import React, { useState,useEffect, useRef } from 'react'
import {Button, Form} from "react-bootstrap"
import {useSelector,useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom"
import {useTranslation} from "react-i18next";
import {Typeahead} from "react-bootstrap-typeahead";
import ReactQuill from "react-quill"
import {MdCloudUpload} from "react-icons/md";
import {BsPatchPlusFill} from "react-icons/bs"
import {useDropzone} from "react-dropzone"
import Slider from "react-indiana-drag-scroll"
import axios from "axios";
import {useQueryClient,useMutation, useQuery} from "@tanstack/react-query"
import {ToastContainer,toast} from "react-toastify"
import {toastOptions} from "../utils/toastOptions";




import { categories } from '../utils/categories';
import { keys } from '../env';
import {axiosFetch} from '../axios'


const initialState={
  reviewName:"",
  reviewedPiece:"",
  group:categories[0],
  grade:"",

}

const CreateReview = ({update}) => {
  
  const {id}=useParams();
  const navigate=useNavigate();
  const client=useQueryClient();
  const [values,setValues]=useState(initialState);
  const [reviewText,setReviewText]=useState("");
  const [tags,setTags]=useState([])
  const [selected,setSelected]=useState([])
  const {t}=useTranslation();
  const [showDropdown,setShowDropdown]=useState(false);
  const [images,setImages]=useState([])
  const [rawValues,setRawValues]=useState([])
  const [errors,setErrors]=useState({})
  const [deletedImgs,setDeletedImgs]=useState([])
  const sliderRef=useRef();

  useEffect(()=>{
    const fetchTags=async()=>{
        const {data}=await axiosFetch.get("/reviews/tags",{withCredentials:true});
        return data;
    }  
    fetchTags().then(data=>{
        setTags(data.map(item=>item.tags));
    }) 
  },[])

  console.log(tags);

  useEffect(()=>{
    console.log(sliderRef.current)
    if(sliderRef.current) {
        const left=sliderRef.current.offsetWidth;
        console.log(left);
        console.log(sliderRef.current.scrollLeft);
        sliderRef.current.scrollLeft+=left;
    }
  },[images])

 useEffect(()=>{
  setValues(initialState);
  const fetchReview=async()=>{
    const response=await axiosFetch.get(`/reviews/${id}`);
    return response.data;
  
  }
  if(update) {
    fetchReview().then(data=>{
      setValues({
        reviewName:data.review.reviewName,
        reviewedPiece:data.review.reviewedPiece,
        group:data.review.group,
        grade:data.review.grade

      })
      setSelected(data.review.tags.split(","))
      setReviewText(data.review.reviewText);
      setImages(data.review.reviewImages.filter(item=>!item.isDefault).map(item=>({name:item.id,img:item.img,uploaded:true})))
    })
   
   
  }
 },[update,id])

 
 const {getRootProps,getInputProps}=useDropzone({
    accept:"image/*",
    onDrop:(acceptedFiles)=>{
      setRawValues(prev=>prev.concat(...acceptedFiles));
      setImages(prev=>prev.concat(acceptedFiles.map(item=>({img:URL.createObjectURL(item),name:item.name}))))
    }
 })




  const handleChange=(e)=>{
    setValues(prev=>({...prev,[e.target.name]:e.target.value}));
  }
  
  const keyDownHandler=e=>{
    if(e.keyCode===8&&e.target.value.length===1) {
      setShowDropdown(false);
    }else{
      setShowDropdown(true);
    }
    
  }



 const cancelHandler=async(img,name,uploaded,e)=>{
    e.stopPropagation();
    if(update&&uploaded) {
        setDeletedImgs(prev=>[...prev,name]);
    }
    setRawValues(rawValues.filter(item=>item.name!==name));
    setImages(images.filter(image=>image.img!==img));
    
 }

 const upload=async()=>{
    let images=[];
   

    for(const file of rawValues) {
      const formData=new FormData();
      formData.append("file",file);
      formData.append("upload_preset",keys.UPLOAD_PRESET);
      const response=await axios.post(`https://api.cloudinary.com/v1_1/${keys.MY_CLOUD_NAME}/image/upload`,formData);
      console.log(response);
      images.push(response.data.secure_url);
    
    }
   
     
      
     
     console.log(images);
   
    return images;
 }

 console.log(selected);

 const reviewMutation=useMutation(async(review)=>{
  let imgs=[];
    if(images.length) {
      imgs=await upload();
     
      
    }
    return axiosFetch.post("/reviews",{...review,images:imgs},{withCredentials:true});

 },{
  onSuccess:({data})=>{
    setTimeout(()=>{
      navigate("/");
    },2000);
    console.log(data.msg);
    toast.success(t(data.msg),toastOptions);
    
  },
  onError:err=>{
    if(err.response?.data) {
      setErrors(err.response.data);
    }
  }
 })

 
const updateMutation=useMutation(async(review)=>{
  let imgs=[];
    if(images.filter(item=>!item.uploaded).length) {
        imgs=await upload();
    }

    return axiosFetch.put(`/reviews/edit/${id}`,{...review,addedImages:imgs,deletedImages:deletedImgs})
    
},{
  onSuccess:({data})=>{
    console.log(data);
    toast.success(data.msg,toastOptions)
    setTimeout(()=>{
      navigate("/")
    },2000)
   
  }
})
 
  return (
    <div className="create">
      <Form onSubmit={e=>e.preventDefault()} className='form'>
      <h2>{t("create_review")}</h2>
      <hr/>
      <Form.Group className='mb-2'>
        <Form.Label>{t("review_name")}</Form.Label>
        <Form.Control isInvalid={errors.reviewName} value={values.reviewName} name="reviewName" onChange={handleChange} type="text"/>
        {errors.reviewName && <p className='error'>{errors.reviewName}</p>}
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>{t("reviewed_piece")}</Form.Label>
        <Form.Control isInvalid={errors.reviewedPiece} value={values.reviewedPiece} name="reviewedPiece" onChange={handleChange} type="text"/>
        {errors.reviewedPiece && <p className='error'>{errors.reviewedPiece}</p>}
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>{t("group")}</Form.Label>
        <Form.Select name="group" value={values.group} onChange={handleChange}>
          {categories.map(cat=>(
            <option value={cat} key={cat}>{cat.charAt(0).toUpperCase()+cat.substring(1,cat.length)}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className='mb-2'>
            <Form.Label>{t("tags")}</Form.Label>
            <Typeahead isInvalid={errors.tags}   className={`${!showDropdown?"hide":""}`} onKeyDown={keyDownHandler} allowNew multiple id="tags" onChange={selected=>setSelected(selected.map(item=>typeof item==="object"?item.label:item))} selected={selected} options={tags}/>
            {errors.tags && <p className='error'>{errors.tags}</p>}
      </Form.Group>
      <Form.Group className='mb-2'>
              <Form.Label>{t("review_text")}</Form.Label>
              <ReactQuill onChange={setReviewText} value={reviewText}/>
              {errors.reviewText && <p className='error'>{errors.reviewText}</p>}

      </Form.Group>

      <Form.Group className='mb-2'>
        <Form.Label>{t("images")}</Form.Label>
       {images.length? (<div {...getRootProps()} className='uploads'>
       <Form.Control {...getInputProps()} type="file" className="d-none"/>
           
            <Slider innerRef={sliderRef}   hideScrollbars={false} className="slider" >
            {images.map(img=>(
          <div className="img">
            <img src={img.img} alt=""/>
            <div onClick={(e)=>cancelHandler(img.img,img.name,img.uploaded,e)} className="cancel">X</div>
          </div>
        ))}
            </Slider>
            
            
      
      
        <div className="plus"><BsPatchPlusFill size={100}/></div>
       </div>):(
        <div {...getRootProps()} className="imgContainer">
        <Form.Control {...getInputProps()} type="file" className="d-none"/>
          <MdCloudUpload size={35}/>
          <p className='mt-15'>{t("upload_text")}</p>
      </div>
       )} 
      </Form.Group>

      <Form.Group className='mb-2'>
        <Form.Label>{t("grade")}</Form.Label>
        <Form.Control value={values.grade} isInvalid={errors.grade} name="grade" onChange={handleChange} className='grade' type="number"/>
        {errors.grade && <p className='error'>{errors.grade}</p>}
      </Form.Group>

      <Button onClick={update?()=>{
        updateMutation.mutate({
          ...values,
          tags:selected.join(","),
          reviewText
        })
      }:()=>reviewMutation.mutate({
        ...values,
        tags:selected.join(","),
        reviewText
      })} type="submit">{update?"Update":"Create"}</Button>

      

    </Form>
    <ToastContainer/>
    </div>
    
  )
}

export default CreateReview;