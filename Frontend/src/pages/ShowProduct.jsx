import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard'; 
import ProductFilter from '../components/ProductFilter';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    let url = 'http://localhost:5000/api/products';
    if (selectedCategory) {
      url += `?category_id=${selectedCategory}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('โหลดข้อมูลล้มเหลว');
        }
        return res.json();
      })
      .then((data) => {
        const productList = Array.isArray(data) ? data : data.products || data.data;
        setProducts(productList || []);
      })
      .catch((err) => {
        console.error('เกิดข้อผิดพลาด:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="p-6">
      <ProductFilter 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
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
