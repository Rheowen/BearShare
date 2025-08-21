import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const LoginForm = ({ onSwitch }) => {
  const { login } = useAppContext(); 

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      await login(form.email, form.password); // login จาก context
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex justify-between items-center my-0 h-110 bg-[#FAAB78] rounded-md'>
      <div className='relative p-6  rounded w-2/3 flex flex-col items-center justify-center bg-white h-110 rounded-md'>
        <h2 className='text-2xl  mb-8'>Login</h2>
             <div className="relative w-1/2 mb-4">
          <div className="absolute -top-2 left-3 bg-white px-1 flex items-center">
            <img src="/envelope.svg" alt="email-icon" className="w-3 h-3 mr-1" />
            <p className="text-xs text-gray-600">Email</p>
          </div>
          <input
             type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            className="w-full border-2 border-[#858585] rounded-xl p-3 placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#FAAB78]"
          />
        </div>

            <div className="relative w-1/2 mb-4">
          <div className="absolute -top-2 left-3 bg-white px-1 flex items-center">
            <img src="/lock.svg" alt="password-icon" className="w-3 h-3 mr-1" />
            <p className="text-xs text-gray-600">Password</p>
          </div>
           <input 
           name="password" 
           type={showPassword ? "text" : "password"} 
            placeholder="Password" 
           value={form.password} 
           onChange={handleChange} 
            className="w-full  border-[#858585] border-2 rounded-xl p-3 placeholder:text-sm placeholder:text-gray-400  focus:outline-none focus:border-[#FAAB78] " />
               {form.password && (
                <button type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-5">
                 {showPassword ?   
                  <img src="/eye.svg" alt="user-icon" className="w-3 h-3 " /> : 
                  <img src="/eye-crossed.svg" alt="user-icon" className="w-3 h-3 " />}
                </button>
                    )}
                  </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                   <button onClick={handleSubmit} 
                   className=' className=" w-80 bg-[#FAAB78] text-black p-2 mt-2 rounded   hover:bg-[#FAA167] cursor-pointer'>
                    Login</button>        
      </div>
      <div 
      className=' bg-[#FAAB78] p-0 m-0  h-full  rounded-xl w-1/3  h-full flex flex-col items-center
       justify-center '>
        <img src="/Logo-bearshear.svg" alt="logo"  className='w-30 h-30 '/>
         <p className='text-xl font-semibold text-[#E8F3D6]'>Welcome Back!</p>
       <p className='text-sm font-light text-[#E8F3D6] mt-2'> Don't have an account? </p>
        <button onClick={onSwitch}
         className="bg-[#FAAB78] w-20 mt-4 rounded-md p-2 border-2 border-[#E8F3D6] text-[#E8F3D6] 
         hover:bg-[#E8F3D6] hover:text-[#FAAB78]  transition-all ease-in-out cursor-pointer" >
         Sign Up
        </button>
      </div>
      
    
  
    </div>
  );
};

export default LoginForm;
