import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const LoginForm = ({ onSwitch }) => {
  const { login } = useAppContext(); 

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
      await login(form.email, form.password); // ✅ เรียก login จาก context
    } catch (err) {
      setError(err.message || 'Something went wrong');
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
