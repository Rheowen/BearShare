import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/authApi.js"; 

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(null);
  const [product, setProduct] = useState([]);

  // ===== LOGIN =====
  const handleLogin = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      setIsSeller(data.user.role === "seller");
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

  // ===== LOGOUT =====
  const logout = () => {
    setUser(null);
    setIsSeller(null);
    navigate("/");
  };

  // ===== CONTEXT VALUE =====
  const value = {
    user,
    setUser,
    isSeller,
    setIsSeller,
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
