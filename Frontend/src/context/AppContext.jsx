import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/authApi.js";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);       // สำหรับ Admin
  const [userOrders, setUserOrders] = useState([]); // สำหรับ user

  const token = localStorage.getItem("token");

  // ===== LOGIN =====
  const handleLogin = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      setIsAdmin(data.user.role === "admin");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
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
    setIsAdmin(false);
    setOrders([]);
    setUserOrders([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ===== Fetch Orders (Admin) =====
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
      else console.error("Fetch admin orders error:", data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Fetch My Orders (User) =====
  const fetchUserOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUserOrders(data);
      else console.error("Fetch user orders error:", data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== useEffect โหลด user จาก localStorage =====
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setIsAdmin(u.role === "admin");
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        orders,
        userOrders,
        login: handleLogin,
        register: handleRegister,
        logout,
        fetchOrders,
        fetchUserOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
