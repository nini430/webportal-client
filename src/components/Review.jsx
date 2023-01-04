import React from 'react'
import {Link} from "react-router-dom"
import {Card,Button} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import {Rating} from "react-simple-star-rating"
import Slider from "react-slick"
import moment from "moment";


import { keys } from '../env'


const Review = ({review}) => {
  const {t}=useTranslation();
  const {reviewName,uuid,reviewImages,reviewedPiece,grade,averageRating,createdAt,user:{firstName,lastName,profileImg,uuid:userId,profUpdated}}=review;
  return (
    <Card>
        <Card.Header>{reviewName}</Card.Header>
        <Card.Body>
        <Slider autoplay autoplaySpeed={2000}>
        {reviewImages?.map(img=>(
          <img src={img.isDefault? keys.PF+img.img:img.img} alt=""/>
        ))}
        </Slider>
        <p className='mt-2'><strong>{t("reviewed_piece")}</strong> {reviewedPiece} </p>
        <p className='mt-2'><strong>{t("grade")}</strong> {grade}</p>
        <p className='mt-2 d-flex align-items-center gap-3'><strong>{t("average_rating")}</strong> <Rating  allowFraction initialValue={averageRating} readonly/></p>

        </Card.Body>
        <Link to={`/profile/${userId}`} className='link'>
        <Card.Footer className='d-flex justify-content-around align-items-center'>
          <div className="left d-flex align-items-center ">
            <img  src={profUpdated?profileImg:keys.PF+profileImg} alt="" />
            <span>{firstName} {lastName}</span>
          </div>
          <div className="right">
          <p className='mt-2 '>{t("created_at")}: {moment(createdAt).format("L")}</p>
          </div>
        </Card.Footer></Link>
        <Link className="link" to={`/review/${uuid}`}><Button className='view'>View More</Button></Link>
    </Card>
  )
}

export default Review;