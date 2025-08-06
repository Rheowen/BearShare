import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const SignupForm = ({ onSwitch }) => {
  const { register } = useAppContext(); //เรียก register จาก context

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      await register(form); //เรียก context (จะ navigate ให้อัตโนมัติ)
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className=' absalust flex-1/2 item-center my-5 mx-5 '>
      <div>
        <img src="" alt="" />
      </div>
      <div className=''>
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded mb-3" />
      <input name="phone" type="text" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded mb-4" />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      
      <button onClick={handleSubmit} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-500">
        Sign Up
      </button>

      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <span onClick={onSwitch} className="text-blue-600 cursor-pointer underline">
          Login
        </span>
      </p>

      </div>
    
  
    </div>
  );
};

export default SignupForm;
