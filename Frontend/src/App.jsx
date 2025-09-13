import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { useAppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ShowProduct from './pages/ShowProduct';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';
import RentForm from './pages/RentFrom';
import AdminDashboard from './pages/AdminDashboard';
import MyOrders from './pages/MyOrders';
import ProfilePage from './pages/ProfilePage';



const App = () => {
  const [data, setData] = useState(null);


  useEffect(() => {
    fetch('http://localhost:5000/api/check-db') 
      .then(res => res.json())
      .then(info => setData(info))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <Navbar />
    
      <div className="px-6 md:px-12 lg:px-24 xl:px-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
         <Route path="/products" element={<ProductsPage />} />
         <Route path="/marketplace" element={<ShowProduct />} />
         <Route path="/products/:productId" element={<ProductDetail />} />
         <Route path="/rent/:id" element={<RentForm />} />
         <Route path="/admin/add-product" element={<AddProduct />} />
         <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
