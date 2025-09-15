import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard.jsx';


const NewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {  
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products?limit=6');
        if (!res.ok) throw new Error('โหลดข้อมูลล้มเหลว');
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(productList);
      } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  

  
  
  return (
    <div className="mt-16 px-10">
      <p className="font-bold text-xl font-Prompt">ใหม่! ของใช้เด็กน่ารัก ราคาประหยัด</p>
      <div className="flex flex-wrap gap-4 mt-6  justify-between items-center">
         {products.length === 0 ? (
      <p className="text-gray-500">ไม่มีสินค้า</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.product_id || product.id}
            product={product}
          />
        ))}
      </div>
       )}
      </div>

      <div className="flex items-center justify-center mt-6">
        <button className="mt-4 px-8 py-2 bg-black text-white rounded hover:bg-[#222831] transition-colors cursor-pointer">
          <p className="text-white">ดูทั้งหมด</p>
        </button>
      </div>
    </div>
  );
};

export default NewProducts;
