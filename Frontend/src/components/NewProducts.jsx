import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard.jsx';

const NewProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ตัวอย่างดึงข้อมูล จำลอง data
    const fetchData = async () => {
      // สมมุติคุณได้ product array จาก backend
      const data = [
        { product_id: 1, title: "เปลเด็ก", price: 199, category: "ของใช้เด็ก" },
        { product_id: 2, title: "ผ้าอ้อม", price: 99, category: "ของใช้เด็ก" },
      ];
      setProducts(data);
    };

    fetchData();
  }, []);

  return (
    <div className="mt-16 px-10">
      <p className="font-bold text-xl font-Prompt">ใหม่! ของใช้เด็กน่ารัก ราคาประหยัด</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            isSeller={false} // ใส่ true ถ้าอยากทดสอบปุ่ม Edit/Delete
          />
        ))}
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
