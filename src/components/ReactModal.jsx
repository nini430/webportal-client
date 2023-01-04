import React, { useState } from 'react'
import {Modal,Nav,Tab,Card,Image} from "react-bootstrap"
import { keys } from '../env'
import { getReactionName } from '../utils/reactions'
import {Rating} from "react-simple-star-rating"

const ReactModal = ({isModalOpen,close,totalReacts,text,reacts,users,reactionProp,rate,like}) => {
    const [activeKey,setActiveKey]=useState(reacts[0])
  return (
    <Modal  show={isModalOpen} onHide={close}>
        <Modal.Header closeButton>
            {totalReacts} {totalReacts>1?"People":"Person"} {text}
        </Modal.Header>
        <Modal.Body>
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
                <Nav variant="tabs">
                {reacts.map(react=>(
                    <Nav.Link key={react} eventKey={react}>{react}</Nav.Link>
                ))}
                </Nav>
                <Tab.Content className='mt-1'>
                   {reacts.map(react=>(
                    <Tab.Pane className='tabPane' eventKey={react}>
                       {(reactionProp?users.filter(({reaction})=>reaction.emoji===getReactionName(react)):users).map(({user,rating})=>(
                        <Card className='mb-2'>
                            <Card.Header>{user.firstName} {user.lastName}</Card.Header>
                            <Card.Body className='w-100'>
                                <div className=" d-flex justify-space-between align-items-center">
                                <Image width={50} height={50} thumbnail src={user.profUpdated?user.profileImg:keys.PF+user.profileImg}/>
                                    <span>{rate? <Rating readonly allowFraction initialValue={rating.rating}/>:react}</span>
                                </div>
                                
                            </Card.Body>
                            <Card.Footer>Personal rating: 4.9</Card.Footer>
                        </Card>
                       ))}
                    </Tab.Pane>
                   ))}
                </Tab.Content>
            </Tab.Container>
        </Modal.Body>
    </Modal>
  )
}

export default ReactModal;