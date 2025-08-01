import React, { createContext, useState, useContext, use } from "react";
import { useNavigate } from "react-router-dom";



export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
   const [product, setProduct] = useState([]);

  //  const fetchProducts = async () => {}
  //   useEffect(() => { 
  //      fetchProducts();
  // }, []);

  const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, product};

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
