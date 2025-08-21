import React, { createContext, useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/authApi.js"; 

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [product, setProduct] = useState([]);

  // ===== LOGIN =====
const handleLogin = async (email, password) => {
  try {
    const data = await authApi.login(email, password);
    setUser(data.user);
    setIsAdmin(data.user.role === "admin");
    localStorage.setItem('token', data.token);   // เก็บtoken 
    navigate("/");
  } catch (err) {
    console.error("Login error:", err.message);
    alert("Login failed");
  }
};

  // ===== REGISTER =====
  const handleRegister = async (formData) => {
    try {
      await authApi.register(formData);
      alert("Register success! Please login.");
      navigate("/login?mode=login");
    } catch (err) {
      console.error("Register error:", err.message);
      alert("Register failed");
    }
  };

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  if (storedUser && storedToken) {
    setUser(JSON.parse(storedUser));
    setIsAdmin(JSON.parse(storedUser).role === 'admin');
    // ถ้าต้องใช้ token ใน fetch api ก็เก็บไว้ที่ state หรือไว้ใน localStorage
  }
}, []);

  // ===== LOGOUT =====
  const logout = () => {
    setUser(null);
    setIsAdmin(null);
    navigate("/");
  };

  // ===== CONTEXT VALUE =====
  const value = {
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    product,
    setProduct,
    login: handleLogin,
    register: handleRegister,
    logout,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
