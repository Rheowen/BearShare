import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from "../components/ProductCard"
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { productId } = useParams(); // ดึง id จาก URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   const handleRentClick = () => {
    navigate(`/rent/${product.product_id}`);
   };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');

        const data = await res.json();
        // รองรับ response array หรือ object
        setProduct(data.product || data || null);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>กำลังโหลดสินค้า...</p>;
  if (!product) return <p>ไม่พบสินค้า</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto flex justify-between items-center">
      <div className="flex flex-col md:flex-row gap-6 w-1/2">
        <img
          src={product.image || 'https://via.placeholder.com/400x300'}
          alt={product.title}
          className="w-full md:w-1/2 object-cover rounded"
        />
      </div>
      <div className=' w-flex flex-col md:flex-row gap-6 w-1/2 '>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <div className="md:w-1/2">
          <p className="text-gray-700 mb-2">{product.category}</p>
           <p className="text-gray-700 mb-2">{product.category}</p>
          <p className="text-indigo-500 text-2xl font-semibold mb-4">${product.price}</p>
          <p className="text-gray-600 mb-4">{product.description || 'ไม่มีรายละเอียด'}</p>
          {/* เพิ่มปุ่ม Add หรือซื้อได้ */}
           <button onClick={handleRentClick}
                  className="bg-[#FAAB78] w-20 mt-4 rounded-md p-2 border-2 border-[#E8F3D6] text-[#E8F3D6] 
                  hover:bg-[#E8F3D6] hover:text-[#FAAB78]  transition-all ease-in-out cursor-pointer"
                >
                 Go Rent
                </button>     
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
