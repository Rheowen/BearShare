import React from 'react'
import imageCate from '../assets/Catego.jpg'
import { useAppContext } from '../context/AppContext'




const Categories = () => {

const { navigate } = useAppContext();

  return (
    <div className='mt-20 px-10 '>
      <p className='font-bold text-xl font-Prompt'>คอลเล็กชันแนะนำ</p>
      <div className="flex flex-wrap gap-4 mt-6 items-center">
        <div className="flex flex-col items-center cursor-pointer" onClick={() => { navigate('/products'); scrollToTop(0, 0); }}>
          <img src={imageCate} alt="" className="w-40 h-40 rounded-full object-cover hover:scale-105 transition-transform duration-300" />
          <p className="text-center mt-2">Dolls</p>
        </div>
      </div>
    </div>




  )
}

export default Categories
