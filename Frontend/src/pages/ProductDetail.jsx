import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from "../components/ProductCard"

const ProductDetail = () => {
  const { productId } = useParams(); // ดึง id จาก URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.image || 'https://via.placeholder.com/400x300'}
          alt={product.title}
          className="w-full md:w-1/2 object-cover rounded"
        />
        <div className="md:w-1/2">
          <p className="text-gray-700 mb-2">{product.category}</p>
          <p className="text-indigo-500 text-2xl font-semibold mb-4">${product.price}</p>
          <p className="text-gray-600 mb-4">{product.description || 'ไม่มีรายละเอียด'}</p>
          {/* เพิ่มปุ่ม Add หรือซื้อได้ */}
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
