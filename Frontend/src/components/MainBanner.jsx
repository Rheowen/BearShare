import React from 'react'
import mainBanner from '../assets/main-banner.jpg';
import { Link } from 'react-router-dom';




const MainBanner = () => {
  return (
  <div className="flex -mt-11 justify-between items-center  bg-white ">
  <div className="w-1/2">
   <h1 className='text-3xl  mb-2'>
      Welcome to <span className="font-bold text-[#FAAB78] text-5xl" >Bear Shear</span> 
   </h1>
   <p className='text-4xl'>Community</p>
    <p className='mb-4 mt-2'>สำหรับพ่อแม่ที่ต้องการ<br />แบ่งปัน ซื้อขาย หรือให้เช่าสิ่งของสำหรับเด็ก</p>
    <Link to="/marketplace"  className="relative w-40    mt-4 px-6 py-2 bg-[#FFDCA9] font-promt rounded-lg shadow-md hover:bg-[#FCF9BE] transition-all ease-in-out cursor-pointer">
             Shop Now
    </Link>                                     

  </div>
  <div className="w-1/2">
    <img 
      src={mainBanner}
      alt="Main Banner"
      className="w-full h-auto rounded-xl"
    />
  </div>
</div>
  )
}

export default MainBanner
