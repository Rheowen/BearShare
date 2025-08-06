import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard'; // ปรับ path ตามโครงสร้างโปรเจกต์จริง

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('โหลดข้อมูลล้มเหลว');
        }
        return res.json();
      })
      .then((data) => {
        const productList = Array.isArray(data) ? data : data.products;
        setProducts(productList || []);
      })
      .catch((err) => {
        console.error('เกิดข้อผิดพลาด:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">สินค้า</h1>
      {products.length === 0 ? (
        <p>ไม่มีสินค้า</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowProduct;
