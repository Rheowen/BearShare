import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// สร้าง Context
export const AppContext = createContext();

// Provider ที่ใช้ครอบ App ทั้งหมด
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // State หลัก
  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(null);
  const [product, setProduct] = useState([]);

  // ===== LOGIN ====
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      setUser(data);
      setIsSeller(data.role === "seller");
      navigate("/"); // ไปหน้าแรก
    } catch (err) {
      console.error("Login error:", err.message);
      alert("Login failed");
    }
  };

  // ===== REGISTER =====
  const register = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Register failed");
      alert("Register success! Please login.");
      navigate("/login?mode=login");
    } catch (err) {
      console.error("Register error:", err.message);
      alert("Register failed");
    }
  };

  // ===== LOGOUT =====
  const logout = () => {
    setUser(false);
    setIsSeller(null);
    navigate("/");
  };

  // ส่งค่าทั้งหมดผ่าน context
  const value = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    product,
    setProduct,
    login,
    register,
    logout,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// hook ใช้งานง่ายใน Component
export const useAppContext = () => {
  return useContext(AppContext);
};
