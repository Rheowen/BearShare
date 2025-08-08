import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { addProduct } from '../api/productApi'

const AddProduct = () => {
  const navigate = useNavigate();

  const handleAddProduct = async (data) => {
    try {
      await addProduct(data);
      alert('เพิ่มสินค้าสำเร็จ!');
      navigate('http://localhost:5000/admin/products'); 
    } catch (error) {
      console.error('เพิ่มสินค้าไม่สำเร็จ:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    }
  };

  return (
    <div className="add-product-page">
      <h2>เพิ่มสินค้าใหม่</h2>
      <ProductForm onSubmit={handleAddProduct} />
    </div>
  );
};

export default AddProduct;
