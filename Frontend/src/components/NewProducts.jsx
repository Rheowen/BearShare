import React from 'react'
import ProductCard from './ProductCard'

const NewProducts = () => {
  return (
    <div className='mt-16 px-10 '>
      <p className='font-bold text-xl font-Prompt'>ใหม่! ของใช้เด็กน่ารัก ราคาประหยัด</p>
      <div>
        <ProductCard />
      </div>
      <div className='flex items-center justify-center mt-6'>
       <button className='mt-4 px-8 py-2 bg-black text-white rounded hover:bg-[#222831] transition-colors cursor-pointer'
        // onClick={() => navigate('/products') scrollToTop(0, 0)}
        >
        <p className='text-white'>ดูทั้งหมด</p>
      </button>
      </div>
     
    </div>
  )
}

export default NewProducts
