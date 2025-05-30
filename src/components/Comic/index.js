import React from 'react'
import { Link } from 'react-router-dom'
function Comic(props) {
  const data = props.data;
  return (
    <>
      <div className='story-card'>
        <div className='story-card__img-wrap'>
          <img src={data.image} alt="" />
        </div>
        <div className='story-card__content'>
          <h2 className='story-card__tilte'><Link to={`/comics/${data.url}`}>{data['name']}</Link></h2>
          <div className='story-card__description'>{data.description}</div>
          <div className='story-card__info'>
            <span className='story-card__author'>{data.artist}</span>
            <span className='story-card__type border border-primary color-primary fs-12' style={{ padding: 4 + 'px' }}>{data.genre}</span>
          </div>
        </div>
      </div>
    </>

  )
}

export default Comic