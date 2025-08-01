import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import NewProducts from '../components/NewProducts'
// import ProductPreviwe from '../components/ProductPreviwe'

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
