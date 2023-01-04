import React from 'react'
import {Review} from "./"
import Slider from "react-slick"


const ReviewList = ({reviews}) => {

 const settings={
  infinite:false,
  responsive:[
    {
      breakpoint:480,
      settings:{
        slidesToShow:1,
        slidesToScroll:1,
        dots:true
      }
    },
    
    {
      breakpoint:600,
      settings:{
        slidesToShow:2,
        slidesToScroll:2,
        dots:true
      }
    },
    {
      breakpoint:1024,
      settings:{
        slidesToShow:3,
        slidesToScroll:3
      }
    }
  ]
 }

  return (
    <Slider responsive={[
      {
        breakpoint:480,
        settings:{
          slidesToShow:1,
          slidesToScroll:1,
          dots:true
        }
      },
      
      {
        breakpoint:600,
        settings:{
          slidesToShow:2,
          slidesToScroll:2,
          dots:true
        }
      },
      {
        breakpoint:960,
        settings:{
          slidesToShow:2,
          slidesToScroll:2
        }
      }
    ]}  autoplay autoplaySpeed={2000} className='cards' slidesToShow={4}>
      {reviews?.data.map(review=>(
        <Review review={review}/>
      ))}
    </Slider>
  )
}

export default ReviewList;