import React from 'react'
import {Link} from "react-router-dom"
import { useState } from 'react';
import {Card, Nav,Tab,Image} from "react-bootstrap"
import { useSelector } from 'react-redux'
import { Review } from '../components';
import { keys } from '../env';

const SearchResults = () => {
  const {searchResults}=useSelector(state=>state.search);
  const [activeKey,setActiveKey]=useState("users")
  console.log(Object.values(searchResults))
  const resultLength=Object.values(searchResults).reduce((sum,val)=>sum+val.length,0);
  return (
    <div className='search'>
      <h1>Found {resultLength} Results</h1>
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant="tabs">
          <Nav.Link eventKey="users">
          Users
          </Nav.Link>
          <Nav.Link eventKey="reviews">Reviews</Nav.Link>
          <Nav.Link eventKey="comments">Comments</Nav.Link>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="users">
            {searchResults?.users.length ? (
                searchResults?.users.map(user=>(
                  <Link to={`/profile/${user.uuid}`}>
                  <div key={user.uuid} className="userSearch">
                       <Card>
                         <Card.Header>{user.firstName} {user.lastName}</Card.Header>
                         <Card.Body>
                           <Image thumbnail src={user.profUpdated?user.profileImg:keys.PF+user.profileImg} />
                         </Card.Body>
                         <Card.Footer><strong>Personal Rating</strong> - {user.ratingNumber}</Card.Footer>
                       </Card>
                   </div>
                  </Link> 
                 ))):<h1>No Users Found</h1>
                }
            
          </Tab.Pane>
          <Tab.Pane eventKey="reviews">
           {searchResults?.reviews.length? (
            searchResults?.reviews.map(review=>(
              <div className="reviewSearch">
                <Review review={review}/>
              </div>
            ))
           ):<h1>No Reviews Found</h1>}
            
          
            
          </Tab.Pane>
          <Tab.Pane eventKey="comments">
          {searchResults?.comments.length? (
                searchResults?.comments.map(comment=>(
                  <div key={comment.uuid} className="commentSearch">
                    <Review review={comment.review}/>
                    <p><strong>Comment:</strong>{comment.comment}</p>
                    <hr/>
                  </div>
                ))
            ):(<h1>No Comments Found</h1>)}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  )
}

export default SearchResults;