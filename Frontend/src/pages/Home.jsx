import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import NewProducts from '../components/NewProducts'


const Home = () => {
  return (
    <div className='mt-10'>
      <MainBanner />
      <Categories />
      <NewProducts />
    </div>
  )
}

export default Home
