import React from 'react'
import {TagCloud} from 'react-tagcloud'
import {cloudData} from ".././utils/cloudData"

const TagCloudComponent = () => {
  return (
    <div className='tag-cloud'>
        <TagCloud minSize={12} maxSize={35} tags={cloudData}/>
    </div>
  )
}

export default TagCloudComponent;