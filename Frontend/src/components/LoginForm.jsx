import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitch }) => {
  const { setUser } = useAppContext();
  const navigate = useNavigate(); // เพิ่ม useNavigate

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      console.log('Login success:', res.data);
      setUser(res.data.user);

      // ถ้า login สำเร็จให้เปลี่ยนหน้าไป Home
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit}>Login</button>
      <p>
        Don't have an account?{' '}
        <span onClick={onSwitch} style={{ color: 'blue', cursor: 'pointer' }}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
