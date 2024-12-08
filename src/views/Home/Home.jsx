import React from 'react'
import Layout from '../../components/Layout'
import ListStory from '../ListStory/ListStory'
import './Home.scss'

function Home() {
  return (
    <>
    <Layout>
      <div className="main-content">
             <ListStory/>
          </div>
    </Layout>
    
           
    </>
    
  )
}

export default Home